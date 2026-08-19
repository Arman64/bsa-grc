"""BSA GRC - MCP / API token manager tests.

Covers:
- Admin login (single correct attempt to avoid lockout)
- Token CRUD via /api/admin/mcp-tokens (GET, POST, PATCH revoke, DELETE)
- Permission enforcement on /api/mcp/blog (blog:read on GET, blog:write on POST)
- Expiry semantics & revoke/reactivate behaviour
- Regression: public pages still 200
"""
import re
import time
import pytest
import requests

BASE_URL = "https://5089d6bc-2178-4860-a592-ec2144c68b09.preview.emergentagent.com"
ADMIN_EMAIL = "admin@bsagrc.co.id"
ADMIN_PASSWORD = "BSA@GRC2026!"

CREATED_TOKEN_IDS: list[int] = []


@pytest.fixture(scope="module")
def admin_session():
    s = requests.Session()
    r = s.post(f"{BASE_URL}/api/admin/login",
               json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=30)
    assert r.status_code == 200, f"Login failed: {r.status_code} {r.text}"
    assert s.cookies.get("bsa_admin_session"), "session cookie missing"
    yield s
    # Teardown: delete all TEST_ tokens
    try:
        j = s.get(f"{BASE_URL}/api/admin/mcp-tokens", timeout=15).json()
        for t in j.get("data", []):
            if str(t.get("name", "")).startswith("TEST_"):
                s.delete(f"{BASE_URL}/api/admin/mcp-tokens?id={t['id']}", timeout=15)
    except Exception as e:
        print("teardown error:", e)


# ---------------- Menu presence ----------------
def test_mcp_admin_page_requires_auth():
    r = requests.get(f"{BASE_URL}/admin/mcp", allow_redirects=False, timeout=15)
    assert r.status_code in (302, 307, 308)
    assert "/admin/login" in r.headers.get("location", "")


def test_mcp_admin_page_loads_when_authed(admin_session):
    r = admin_session.get(f"{BASE_URL}/admin/mcp", timeout=20)
    assert r.status_code == 200
    html = r.text
    # UI hints
    assert "Token MCP" in html or "token" in html.lower()


# ---------------- Token CRUD ----------------
class TestTokenCRUD:
    def test_list_tokens_ok(self, admin_session):
        r = admin_session.get(f"{BASE_URL}/api/admin/mcp-tokens", timeout=15)
        assert r.status_code == 200
        j = r.json()
        assert j["success"] is True
        assert isinstance(j["data"], list)

    def test_create_requires_name(self, admin_session):
        r = admin_session.post(f"{BASE_URL}/api/admin/mcp-tokens",
                               json={"name": "", "permissions": ["blog:read"]}, timeout=15)
        assert r.status_code == 400
        assert r.json()["success"] is False

    def test_create_token_blog_read(self, admin_session):
        r = admin_session.post(f"{BASE_URL}/api/admin/mcp-tokens",
                               json={"name": "TEST_read_only",
                                     "permissions": ["blog:read"],
                                     "expiresAt": None}, timeout=20)
        assert r.status_code == 200, r.text
        j = r.json()
        assert j["success"] is True
        data = j["data"]
        assert data["name"] == "TEST_read_only"
        assert data["permissions"] == ["blog:read"]
        assert re.match(r"^bsagrc_mcp_[0-9a-f]{48}$", data["token"]), f"bad token fmt: {data['token']}"
        assert data["revoked"] is False
        CREATED_TOKEN_IDS.append(data["id"])
        pytest.read_token = data["token"]
        pytest.read_token_id = data["id"]

    def test_create_token_blog_write(self, admin_session):
        r = admin_session.post(f"{BASE_URL}/api/admin/mcp-tokens",
                               json={"name": "TEST_write_only",
                                     "permissions": ["blog:write"],
                                     "expiresAt": None}, timeout=20)
        assert r.status_code == 200
        data = r.json()["data"]
        CREATED_TOKEN_IDS.append(data["id"])
        pytest.write_token = data["token"]
        pytest.write_token_id = data["id"]

    def test_token_appears_in_list(self, admin_session):
        j = admin_session.get(f"{BASE_URL}/api/admin/mcp-tokens", timeout=15).json()
        ids = {t["id"] for t in j["data"]}
        assert pytest.read_token_id in ids
        assert pytest.write_token_id in ids
        # status active
        for t in j["data"]:
            if t["id"] == pytest.read_token_id:
                assert t["status"] == "active"


# ---------------- Permission enforcement on /api/mcp/blog ----------------
class TestMcpBlogAuth:
    def test_no_key_returns_401_get(self):
        r = requests.get(f"{BASE_URL}/api/mcp/blog?limit=1", timeout=15)
        assert r.status_code == 401

    def test_bogus_key_returns_401(self):
        r = requests.get(f"{BASE_URL}/api/mcp/blog?limit=1",
                         headers={"X-API-KEY": "bogus-not-a-real-key-xyz"}, timeout=15)
        assert r.status_code == 401

    def test_read_token_allows_get(self):
        r = requests.get(f"{BASE_URL}/api/mcp/blog?limit=1",
                         headers={"X-API-KEY": pytest.read_token}, timeout=20)
        assert r.status_code == 200, r.text
        j = r.json()
        assert j["success"] is True
        assert isinstance(j.get("data"), list)

    def test_read_token_forbidden_on_post(self):
        # POST with body missing but auth check should trigger first (returns 401 before body validation)
        r = requests.post(f"{BASE_URL}/api/mcp/blog",
                          headers={"X-API-KEY": pytest.read_token,
                                   "Content-Type": "application/json"},
                          json={"title": "TEST_should_fail", "content": "x"}, timeout=20)
        assert r.status_code == 401, f"expected 401 (missing blog:write) got {r.status_code}: {r.text[:200]}"

    def test_write_token_forbidden_on_get(self):
        # write-only should fail GET (needs blog:read)
        r = requests.get(f"{BASE_URL}/api/mcp/blog?limit=1",
                         headers={"X-API-KEY": pytest.write_token}, timeout=15)
        assert r.status_code == 401


# ---------------- Revoke / Reactivate / Delete ----------------
class TestRevokeReactivateDelete:
    def test_revoke_read_token(self, admin_session):
        r = admin_session.patch(f"{BASE_URL}/api/admin/mcp-tokens",
                                json={"id": pytest.read_token_id, "revoked": True}, timeout=15)
        assert r.status_code == 200
        assert r.json()["success"] is True
        # Verify GET now 401
        time.sleep(0.5)
        g = requests.get(f"{BASE_URL}/api/mcp/blog?limit=1",
                         headers={"X-API-KEY": pytest.read_token}, timeout=15)
        assert g.status_code == 401

    def test_reactivate_read_token(self, admin_session):
        r = admin_session.patch(f"{BASE_URL}/api/admin/mcp-tokens",
                                json={"id": pytest.read_token_id, "revoked": False}, timeout=15)
        assert r.status_code == 200
        time.sleep(0.5)
        g = requests.get(f"{BASE_URL}/api/mcp/blog?limit=1",
                         headers={"X-API-KEY": pytest.read_token}, timeout=15)
        assert g.status_code == 200

    def test_delete_write_token_removes_access(self, admin_session):
        r = admin_session.delete(f"{BASE_URL}/api/admin/mcp-tokens?id={pytest.write_token_id}", timeout=15)
        assert r.status_code == 200
        # Verify list no longer contains it
        j = admin_session.get(f"{BASE_URL}/api/admin/mcp-tokens", timeout=15).json()
        ids = {t["id"] for t in j["data"]}
        assert pytest.write_token_id not in ids
        # And key no longer works
        g = requests.post(f"{BASE_URL}/api/mcp/blog",
                          headers={"X-API-KEY": pytest.write_token,
                                   "Content-Type": "application/json"},
                          json={"title": "x", "content": "x"}, timeout=15)
        assert g.status_code == 401


# ---------------- Expiry ----------------
class TestExpiry:
    def test_expired_token_rejected(self, admin_session):
        # create with expiresAt in the past
        past = "2020-01-01T00:00:00.000Z"
        r = admin_session.post(f"{BASE_URL}/api/admin/mcp-tokens",
                               json={"name": "TEST_expired",
                                     "permissions": ["blog:read"],
                                     "expiresAt": past}, timeout=20)
        assert r.status_code == 200
        data = r.json()["data"]
        CREATED_TOKEN_IDS.append(data["id"])
        # list should show status expired
        j = admin_session.get(f"{BASE_URL}/api/admin/mcp-tokens", timeout=15).json()
        row = next(t for t in j["data"] if t["id"] == data["id"])
        assert row["status"] == "expired"
        # request rejected
        g = requests.get(f"{BASE_URL}/api/mcp/blog?limit=1",
                         headers={"X-API-KEY": data["token"]}, timeout=15)
        assert g.status_code == 401


# ---------------- Public pages regression ----------------
@pytest.mark.parametrize("path", ["/", "/profil", "/layanan", "/portofolio", "/kontak", "/blog"])
def test_public_pages_200(path):
    r = requests.get(f"{BASE_URL}{path}", timeout=20)
    assert r.status_code == 200
