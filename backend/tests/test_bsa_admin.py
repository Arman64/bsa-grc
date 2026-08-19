"""BSA GRC admin + public API tests (Next.js served via ingress proxy)."""
import os
import re
import pytest
import requests

BASE_URL = "https://5089d6bc-2178-4860-a592-ec2144c68b09.preview.emergentagent.com"
ADMIN_EMAIL = "admin@bsagrc.co.id"
ADMIN_PASSWORD = "BSA@GRC2026!"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    return s


@pytest.fixture(scope="module")
def auth_session(session):
    # Login once (careful: brute force limit); use CORRECT credentials only in this fixture
    r = session.post(f"{BASE_URL}/api/admin/login",
                     json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
                     timeout=30)
    assert r.status_code == 200, f"Login failed: {r.status_code} {r.text}"
    assert session.cookies.get("bsa_admin_session"), "session cookie missing"
    return session


# ---- Auth protection ----
class TestAuthProtection:
    def test_admin_me_without_cookie_returns_401(self):
        r = requests.get(f"{BASE_URL}/api/admin/me", timeout=15)
        assert r.status_code == 401

    def test_admin_settings_without_cookie_returns_401(self):
        r = requests.get(f"{BASE_URL}/api/admin/settings", timeout=15)
        assert r.status_code == 401

    def test_admin_page_redirects_when_unauth(self):
        r = requests.get(f"{BASE_URL}/admin/pages", allow_redirects=False, timeout=15)
        # Next.js middleware -> 307 to /admin/login
        assert r.status_code in (302, 307, 308)
        loc = r.headers.get("location", "")
        assert "/admin/login" in loc, f"Expected redirect to /admin/login, got {loc}"

    def test_login_invalid_password_once(self):
        # ONE wrong attempt only (brute force safeguard)
        r = requests.post(f"{BASE_URL}/api/admin/login",
                          json={"email": ADMIN_EMAIL, "password": "definitely-wrong"},
                          timeout=15)
        assert r.status_code in (400, 401), f"Got {r.status_code} {r.text}"
        body = r.text.lower()
        assert "salah" in body or "invalid" in body or "email" in body


# ---- Authenticated endpoints ----
class TestAdminAPIs:
    def test_me(self, auth_session):
        r = auth_session.get(f"{BASE_URL}/api/admin/me", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data.get("email") == ADMIN_EMAIL or data.get("user", {}).get("email") == ADMIN_EMAIL

    def test_get_page_content_beranda(self, auth_session):
        r = auth_session.get(f"{BASE_URL}/api/admin/page-content?slug=beranda", timeout=20)
        assert r.status_code == 200, r.text
        data = r.json()
        # expect structured content
        assert isinstance(data, dict)

    def test_chrome_get(self, auth_session):
        r = auth_session.get(f"{BASE_URL}/api/admin/chrome", timeout=20)
        assert r.status_code == 200
        assert isinstance(r.json(), dict)

    def test_settings_get(self, auth_session):
        r = auth_session.get(f"{BASE_URL}/api/admin/settings", timeout=20)
        assert r.status_code == 200

    def test_change_password_wrong_current(self, auth_session):
        r = auth_session.post(f"{BASE_URL}/api/admin/change-password",
                              json={"currentPassword": "wrongpass123",
                                    "newPassword": "NewPass123!",
                                    "confirmPassword": "NewPass123!"},
                              timeout=15)
        assert r.status_code in (400, 401), f"Expected 4xx, got {r.status_code} {r.text}"

    # Note: confirm-password check is UI-only; API only takes current+new.
    # See app/api/admin/change-password/route.ts


# ---- Page content save->reflect (revertible) ----
class TestPageEditPersistence:
    def test_edit_hero_and_revert(self, auth_session):
        # GET current
        r = auth_session.get(f"{BASE_URL}/api/admin/page-content?slug=beranda", timeout=20)
        assert r.status_code == 200
        payload = r.json()
        data = payload.get("data", payload)
        sections = data.get("sections") or {}
        hero = dict(sections.get("hero") or {})
        original_title = hero.get("titleLine1", "Kontraktor")

        # Save with UJITITLE1
        hero["titleLine1"] = "UJITITLE1"
        sections["hero"] = hero

        put = auth_session.put(
            f"{BASE_URL}/api/admin/page-content",
            json={
                "slug": "beranda",
                "title": data.get("title"),
                "description": data.get("description"),
                "sections": sections,
                "seoTitle": data.get("seoTitle"),
                "seoDescription": data.get("seoDescription"),
            },
            timeout=20,
        )
        assert put.status_code in (200, 204), f"PUT failed: {put.status_code} {put.text}"

        # Fetch public homepage (bust caches)
        home = requests.get(f"{BASE_URL}/?_ts=uji", timeout=20)
        assert home.status_code == 200
        found = "UJITITLE1" in home.text

        # Revert regardless
        hero["titleLine1"] = original_title if original_title != "UJITITLE1" else "Kontraktor"
        sections["hero"] = hero
        rev = auth_session.put(
            f"{BASE_URL}/api/admin/page-content",
            json={
                "slug": "beranda",
                "title": data.get("title"),
                "description": data.get("description"),
                "sections": sections,
                "seoTitle": data.get("seoTitle"),
                "seoDescription": data.get("seoDescription"),
            },
            timeout=20,
        )
        assert rev.status_code in (200, 204)
        assert found, "UJITITLE1 not found on public homepage after save"


# ---- Public pages integrity ----
FORBIDDEN_STRINGS = [
    "dari database",
    "data dari",
    "kelola di /admin",
    "Kenapa Pilih BSA GRC? ()",
    "n8n",
]


@pytest.mark.parametrize("path", ["/", "/profil", "/layanan", "/portofolio", "/kontak", "/blog"])
def test_public_page_no_placeholder(path):
    r = requests.get(f"{BASE_URL}{path}", timeout=20)
    assert r.status_code == 200, f"{path} returned {r.status_code}"
    html = r.text
    for bad in FORBIDDEN_STRINGS:
        assert bad not in html, f"'{bad}' leaked on {path}"


def test_homepage_hero_highlight_terbaik():
    r = requests.get(f"{BASE_URL}/", timeout=20)
    assert r.status_code == 200
    assert "Terbaik" in r.text, "Hero highlight word 'Terbaik' missing on homepage"


def test_contact_form_submit():
    payload = {
        "name": "TEST_User",
        "phone": "081234567890",
        "service": "Kubah GRC",
        "location": "Jakarta Selatan, DKI Jakarta",
        "message": "TEST_message from automated test - permintaan penawaran",
    }
    r = requests.post(f"{BASE_URL}/api/contact", json=payload, timeout=25)
    assert r.status_code == 200, f"Contact submit failed: {r.status_code} {r.text}"
    data = r.json()
    # look for whatsapp link
    text = str(data).lower()
    assert "wa.me" in text or "whatsapp" in text, f"No WhatsApp link in response: {data}"
