"""
Security-fix regression pytest suite for BSA GRC.
Covers: JWT admin login, MCP token lifecycle (hash storage / prefix listing / no reveal),
public MCP blog API auth, blog markdown rendering (link renderer fix), XSS sanitization,
media proxy prefix restriction, admin upload path.
"""
import os
import re
import io
import time
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL") or "https://admin-panel-fix-131.preview.emergentagent.com"
BASE_URL = BASE_URL.rstrip("/")

ADMIN_EMAIL = "admin@bsagrc.co.id"
ADMIN_PASS = "BSA@GRC2026!"


@pytest.fixture(scope="session")
def admin_session():
    s = requests.Session()
    r = s.post(f"{BASE_URL}/api/admin/login",
               json={"email": ADMIN_EMAIL, "password": ADMIN_PASS},
               timeout=15)
    assert r.status_code == 200, r.text
    assert r.json().get("success") is True
    assert "bsa_admin_session" in s.cookies.get_dict(), "session cookie missing"
    return s


# ---------- Admin login regression ----------
def test_admin_login_ok(admin_session):
    r = admin_session.get(f"{BASE_URL}/api/admin/me", timeout=15)
    assert r.status_code in (200, 201), r.text
    data = r.json()
    assert data.get("success") is True
    assert data.get("user", {}).get("email") == ADMIN_EMAIL


# ---------- MCP token lifecycle ----------
class TestMcpTokens:
    created_id = None
    created_raw = None

    def test_list_never_returns_raw_or_hash(self, admin_session):
        r = admin_session.get(f"{BASE_URL}/api/admin/mcp-tokens", timeout=15)
        assert r.status_code in (200, 201), r.text
        data = r.json()
        assert data["success"] is True
        for tok in data["data"]:
            assert "token" not in tok, f"raw token leaked: {tok}"
            assert "tokenHash" not in tok, f"hash leaked: {tok}"
            assert "hashedToken" not in tok
            assert "tokenPrefix" in tok
            assert tok["tokenPrefix"].startswith("bsagrc_mcp_")
            assert tok["tokenPrefix"].endswith("...")

    def test_create_returns_raw_once(self, admin_session):
        r = admin_session.post(f"{BASE_URL}/api/admin/mcp-tokens",
                               json={"name": "TEST_regression", "permissions": ["blog:read", "blog:write"]},
                               timeout=15)
        assert r.status_code in (200, 201), r.text
        d = r.json()["data"]
        assert d["token"].startswith("bsagrc_mcp_")
        assert len(d["token"]) > 40
        assert d["tokenPrefix"].startswith("bsagrc_mcp_")
        TestMcpTokens.created_id = d["id"]
        TestMcpTokens.created_raw = d["token"]

    def test_raw_token_authenticates_mcp_api(self, admin_session):
        assert TestMcpTokens.created_raw
        r = requests.get(f"{BASE_URL}/api/mcp/blog?limit=1",
                         headers={"Authorization": f"Bearer {TestMcpTokens.created_raw}"},
                         timeout=15)
        assert r.status_code in (200, 201), r.text
        assert r.json()["success"] is True

    def test_revoke_blocks_token(self, admin_session):
        r = admin_session.patch(f"{BASE_URL}/api/admin/mcp-tokens",
                                json={"id": TestMcpTokens.created_id, "revoked": True},
                                timeout=15)
        assert r.status_code in (200, 201), r.text
        r2 = requests.get(f"{BASE_URL}/api/mcp/blog?limit=1",
                          headers={"Authorization": f"Bearer {TestMcpTokens.created_raw}"},
                          timeout=15)
        assert r2.status_code == 401

    def test_reactivate(self, admin_session):
        r = admin_session.patch(f"{BASE_URL}/api/admin/mcp-tokens",
                                json={"id": TestMcpTokens.created_id, "revoked": False},
                                timeout=15)
        assert r.status_code in (200, 201), r.text
        r2 = requests.get(f"{BASE_URL}/api/mcp/blog?limit=1",
                          headers={"Authorization": f"Bearer {TestMcpTokens.created_raw}"},
                          timeout=15)
        assert r2.status_code == 200

    def test_delete_token_cleanup(self, admin_session):
        r = admin_session.delete(f"{BASE_URL}/api/admin/mcp-tokens?id={TestMcpTokens.created_id}", timeout=15)
        assert r.status_code in (200, 201), r.text

    def test_hermes_token_preserved(self, admin_session):
        r = admin_session.get(f"{BASE_URL}/api/admin/mcp-tokens", timeout=15)
        names = [t["name"] for t in r.json()["data"]]
        assert "hermes" in names, "real 'hermes' token was unintentionally deleted!"


# ---------- Blog markdown rendering & XSS ----------
class TestBlogRendering:
    created_ids = []

    def test_existing_article_renders_headings_and_table(self):
        r = requests.get(f"{BASE_URL}/perbedaan-kubah-grc-enamel-galvalum-mana-terbaik", timeout=20)
        assert r.status_code in (200, 201), r.text
        html = r.text
        assert re.search(r'<h2 [^>]*id="[^"]+"', html), "h2 anchor headings missing"
        assert '<table' in html, "table not rendered"

    def test_link_renderer_not_crashed(self, admin_session):
        body = {
            "title": "TEST_link_render",
            "slug": f"test-link-render-agent-{int(time.time())}",
            "content": "## Judul\n\nIni **bold** dan [Contoh Link](https://google.com) serta [Internal](/kontak).",
            "isPublished": True,
        }
        r = admin_session.post(f"{BASE_URL}/api/admin/blog", json=body, timeout=15)
        assert r.status_code in (200, 201), r.text
        bid = r.json()["data"]["id"]
        TestBlogRendering.created_ids.append(bid)
        page = requests.get(f"{BASE_URL}/{body['slug']}", timeout=20).text
        # External link -> maroon-600 class
        assert re.search(r'<a href="https://google\.com"[^>]*class="[^"]*maroon-600[^"]*"[^>]*>Contoh Link</a>', page), \
            "external markdown link not rendered correctly"
        # Internal link -> maroon-700
        assert re.search(r'<a href="/kontak"[^>]*class="[^"]*maroon-700[^"]*"[^>]*>Internal</a>', page), \
            "internal markdown link not rendered correctly"
        # Bold word
        assert "<strong>bold</strong>" in page

    def test_xss_in_body_is_sanitized(self, admin_session):
        body = {
            "title": "TEST_xss_body",
            "slug": f"test-xss-body-agent-{int(time.time())}",
            "content": "safe intro. <script>alert(42)</script><img src=x onerror=alert(43)>",
            "excerpt": "safe excerpt",
            "isPublished": True,
        }
        r = admin_session.post(f"{BASE_URL}/api/admin/blog", json=body, timeout=15)
        assert r.status_code in (200, 201), r.text
        bid = r.json()["data"]["id"]
        TestBlogRendering.created_ids.append(bid)
        page = requests.get(f"{BASE_URL}/{body['slug']}", timeout=20).text
        # The rendered article body must NOT contain executable <script>alert or onerror attribute
        # (they might appear inside JSON metadata but sanitize-html should strip them from the article body div)
        article_html_match = re.search(r'<article[^>]*>(.*?)</article>', page, re.S)
        if article_html_match:
            article_html = article_html_match.group(1)
            assert "<script>alert(42)" not in article_html, "unsanitized <script> in article body"
            assert "onerror=alert(43)" not in article_html, "unsanitized onerror in article body"

    def test_xss_in_jsonld_via_excerpt(self, admin_session):
        """SECURITY: excerpt/description is inlined into JSON-LD <script> without escaping </script>."""
        body = {
            "title": "TEST_xss_jsonld_agent",
            "slug": f"test-xss-jsonld-agent-{int(time.time())}",
            "content": "safe",
            "excerpt": "</script><img src=x onerror=alert(777)>",
            "isPublished": True,
        }
        r = admin_session.post(f"{BASE_URL}/api/admin/blog", json=body, timeout=15)
        assert r.status_code in (200, 201), r.text
        bid = r.json()["data"]["id"]
        TestBlogRendering.created_ids.append(bid)
        page = requests.get(f"{BASE_URL}/{body['slug']}", timeout=20).text
        # BUG: raw payload appears inside <script type="application/ld+json">
        jsonld = re.search(r'<script type="application/ld\+json">[^<]*"BlogPosting"[^<]*', page)
        # If the </script> escape is properly done, the raw </script> won't appear as a bare terminator
        # We assert (expected FAIL currently) that the raw dangerous string is NOT present in output
        assert "</script><img src=x onerror=alert(777)>" not in page, \
            "STORED XSS: excerpt inlined into JSON-LD without escaping </script>"

    @classmethod
    def teardown_class(cls):
        s = requests.Session()
        s.post(f"{BASE_URL}/api/admin/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASS}, timeout=15)
        for bid in cls.created_ids:
            try:
                s.delete(f"{BASE_URL}/api/admin/blog?id={bid}", timeout=15)
            except Exception:
                pass


# ---------- JSON-LD safe serialization (iteration_7 fix) ----------
import json as _json

_JSONLD_RE = re.compile(r'<script type="application/ld\+json">(.*?)</script>', re.S)
_DANGER = '</script><img src=x onerror=alert(777)>'


def _extract_jsonlds(html: str):
    """Return list of parsed JSON-LD dicts embedded in the page."""
    parsed = []
    for m in _JSONLD_RE.finditer(html):
        blob = m.group(1)
        parsed.append(_json.loads(blob))  # will raise if escaping corrupted JSON
    return parsed


def _types_of(block):
    t = block.get("@type") if isinstance(block, dict) else None
    if isinstance(t, list):
        return set(t)
    if isinstance(t, str):
        return {t}
    return set()


def _all_types(blocks):
    s = set()
    for b in blocks:
        s |= _types_of(b)
    return s


class TestJsonLdXssFix:
    """Verify safeJsonLd() prevents </script> breakout across all 5 files
    and that JSON-LD remains valid JSON for search engines."""

    created_blog_ids = []

    # (1) blog slug page - articleSchema + breadcrumbSchema via excerpt
    def test_blog_slug_jsonld_escapes_and_parses(self, admin_session):
        slug = f"test-jsonld-xss-blog-{int(time.time())}"
        body = {
            "title": "TEST_jsonld_xss_blog \u2028line",
            "slug": slug,
            "content": "safe body",
            "excerpt": _DANGER,
            "keywords": [_DANGER, "normal"],
            "isPublished": True,
        }
        r = admin_session.post(f"{BASE_URL}/api/admin/blog", json=body, timeout=15)
        assert r.status_code in (200, 201), r.text
        self.__class__.created_blog_ids.append(r.json()["data"]["id"])
        page = requests.get(f"{BASE_URL}/{slug}", timeout=20).text
        # No raw breakout
        assert _DANGER not in page, "blog slug: raw </script> breakout present"
        # Escaped form should be there
        assert "\\u003c/script\\u003e" in page or "\\u003c/script" in page.replace("\\u003c/", "\\u003c/"), \
            "blog slug: expected unicode-escaped </script"
        # All JSON-LD blocks parse & at least one is BlogPosting containing our excerpt (unescaped by JSON parse)
        blocks = _extract_jsonlds(page)
        assert any(b.get("@type") == "BlogPosting" for b in blocks), "BlogPosting schema missing"
        blog_schema = next(b for b in blocks if b.get("@type") == "BlogPosting")
        assert blog_schema.get("description") == _DANGER, \
            "excerpt not preserved through escape/parse round-trip"

    # (2) homepage - faqSchema
    def test_homepage_jsonld_valid(self):
        page = requests.get(f"{BASE_URL}/", timeout=20).text
        assert _DANGER not in page  # (defensive: static content shouldn't have it)
        blocks = _extract_jsonlds(page)
        assert len(blocks) >= 1, "homepage has no JSON-LD"
        # FAQPage or LocalBusiness or Organization expected
        types = _all_types(blocks)
        assert types & {"FAQPage", "LocalBusiness", "Organization"}, f"unexpected schema types: {types}"

    # (3) service landing page - serviceSchema / breadcrumbSchema / faqSchema
    def test_service_landing_jsonld_valid(self):
        page = requests.get(f"{BASE_URL}/layanan/menara", timeout=20).text
        blocks = _extract_jsonlds(page)
        assert len(blocks) >= 2, f"expected >=2 schemas on service page, got {len(blocks)}"
        # No raw <script> breakout inside any inline JSON-LD content
        # Also check the whole page has no bare '</script><img' sequence
        assert "</script><img" not in page

    # (4) portfolio detail page - projectSchema
    def test_portfolio_detail_jsonld_valid(self):
        page = requests.get(f"{BASE_URL}/portofolio/6", timeout=20).text
        blocks = _extract_jsonlds(page)
        assert len(blocks) >= 1, "portfolio page has no JSON-LD"
        # Any of these are plausible from portfolio + layout
        types = _all_types(blocks)
        assert types, "no @type found in portfolio JSON-LD"

    # (5) root layout localBusinessSchema (present on every page - already covered, but assert explicitly)
    def test_layout_localbusiness_present(self):
        page = requests.get(f"{BASE_URL}/", timeout=20).text
        blocks = _extract_jsonlds(page)
        assert any("LocalBusiness" in _types_of(b) for b in blocks), \
            "LocalBusiness schema from root layout missing"

    # Additional: try XSS via keywords array on blog
    def test_blog_keywords_array_safe(self, admin_session):
        slug = f"test-jsonld-xss-kw-{int(time.time())}"
        body = {
            "title": "TEST_jsonld_kw",
            "slug": slug,
            "content": "safe",
            "excerpt": "safe excerpt",
            "keywords": ["</script><script>alert(1)</script>", "ok"],
            "isPublished": True,
        }
        r = admin_session.post(f"{BASE_URL}/api/admin/blog", json=body, timeout=15)
        assert r.status_code in (200, 201), r.text
        self.__class__.created_blog_ids.append(r.json()["data"]["id"])
        page = requests.get(f"{BASE_URL}/{slug}", timeout=20).text
        assert "</script><script>alert(1)</script>" not in page
        blocks = _extract_jsonlds(page)
        # Confirm at least one BlogPosting present and JSON parses
        assert any(b.get("@type") == "BlogPosting" for b in blocks)

    # Regression: normal article w/o special chars still renders + JSON-LD ok
    def test_normal_article_still_ok(self, admin_session):
        slug = f"test-jsonld-normal-{int(time.time())}"
        body = {
            "title": "TEST Normal Article",
            "slug": slug,
            "content": "## Heading\n\nplain body text.",
            "excerpt": "A plain excerpt.",
            "isPublished": True,
        }
        r = admin_session.post(f"{BASE_URL}/api/admin/blog", json=body, timeout=15)
        assert r.status_code in (200, 201), r.text
        self.__class__.created_blog_ids.append(r.json()["data"]["id"])
        page = requests.get(f"{BASE_URL}/{slug}", timeout=20).text
        blocks = _extract_jsonlds(page)
        blog = next((b for b in blocks if b.get("@type") == "BlogPosting"), None)
        assert blog is not None
        assert blog.get("headline") == "TEST Normal Article"
        assert blog.get("description") == "A plain excerpt."

    def test_blog_listing_still_renders(self):
        r = requests.get(f"{BASE_URL}/blog", timeout=20)
        assert r.status_code == 200
        assert "<html" in r.text.lower()

    @classmethod
    def teardown_class(cls):
        s = requests.Session()
        s.post(f"{BASE_URL}/api/admin/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASS}, timeout=15)
        for bid in cls.created_blog_ids:
            try:
                s.delete(f"{BASE_URL}/api/admin/blog?id={bid}", timeout=15)
            except Exception:
                pass


# ---------- Media proxy prefix restriction ----------
class TestMediaProxy:
    def test_non_bsagrc_prefix_blocked(self):
        for path in ["some-random/file.jpg", "etc/passwd", "foo/bar.png"]:
            r = requests.get(f"{BASE_URL}/api/media/{path}", timeout=15, allow_redirects=False)
            assert r.status_code == 404, f"expected 404 for {path}, got {r.status_code}"

    def test_bsagrc_prefix_still_serves(self, admin_session):
        listing = admin_session.get(f"{BASE_URL}/api/admin/media?limit=1", timeout=15).json()
        if not listing.get("data"):
            pytest.skip("no media in library")
        url = listing["data"][0]["url"]
        assert url.startswith("/api/media/bsa-grc/")
        r = requests.get(f"{BASE_URL}{url}", timeout=15)
        assert r.status_code in (200, 201), r.text
        assert r.headers.get("content-type", "").startswith("image/")


# ---------- Admin upload still works ----------
def test_admin_upload_ok(admin_session):
    png = bytes.fromhex(
        "89504E470D0A1A0A0000000D49484452000000010000000108060000001F15C4890000000A"
        "49444154789C6300010000000500017E44738D0000000049454E44AE426082"
    )
    files = {"file": ("t.png", io.BytesIO(png), "image/png")}
    data = {"folder": "general"}
    # requests session-based multipart upload
    r = admin_session.post(f"{BASE_URL}/api/admin/upload", files=files, data=data, timeout=30)
    assert r.status_code == 200, r.text
    d = r.json()
    assert d["success"] is True
    assert d["data"]["url"].startswith("/api/media/bsa-grc/")
    # fetch back
    r2 = requests.get(f"{BASE_URL}{d['data']['url']}", timeout=15)
    assert r2.status_code == 200
    # cleanup
    admin_session.delete(f"{BASE_URL}/api/admin/media?id={d['data']['mediaId']}", timeout=15)
