// ============================================================
// course-og — dynamic Open Graph/Twitter Card tags for a single course.
//
// Static sites can't vary <head> tags per URL for link-preview bots (they
// never run JavaScript, so the client-side title/description swap the real
// page does is invisible to them) — every shared course-detail.html link
// showed the same hardcoded title. This function is only ever reached by a
// known preview-bot User-Agent (see vercel.json's rewrite `has` condition);
// real visitors always get the normal static page, completely untouched.
//
// Uses only the public anon key against data that's already publicly
// readable by anyone (courses.status = 'published' is a public SELECT policy)
// — no new secret, no elevated access, no write of any kind.
// ============================================================

const SUPABASE_URL = 'https://rbncpakigxzbstefisgd.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_XFRsJzrx35nobAiGaxehpg_ugez4hu2';
const SITE_URL = 'https://learn.nekomeowtoken.com';
const DEFAULT_TITLE = 'Neko Academy';
const DEFAULT_DESCRIPTION = 'Access crypto and blockchain courses anytime, anywhere with Neko Academy.';
const DEFAULT_IMAGE = `${SITE_URL}/assets/img/og-image.jpg`;

function escapeHtml(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

module.exports = async (req, res) => {
  const slugParam = req.query && req.query.slug;
  const slug = typeof slugParam === 'string' ? slugParam : Array.isArray(slugParam) ? slugParam[0] : '';

  let course = null;
  if (slug) {
    try {
      const resp = await fetch(
        `${SUPABASE_URL}/rest/v1/courses?slug=eq.${encodeURIComponent(slug)}&status=eq.published&select=title,subtitle,thumbnail_url,slug`,
        { headers: { apikey: SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}` } },
      );
      if (resp.ok) {
        const rows = await resp.json();
        course = Array.isArray(rows) && rows[0] ? rows[0] : null;
      }
    } catch (e) {
      // Network/parsing failure — fall through to the default metadata below
      // rather than erroring the preview out entirely.
    }
  }

  const title = course ? `${course.title} — Neko Academy` : DEFAULT_TITLE;
  const description = course ? (course.subtitle || DEFAULT_DESCRIPTION) : DEFAULT_DESCRIPTION;
  const image = (course && course.thumbnail_url) ? course.thumbnail_url : DEFAULT_IMAGE;
  const canonicalUrl = course
    ? `${SITE_URL}/course-detail.html?slug=${encodeURIComponent(course.slug)}`
    : `${SITE_URL}/course-detail.html`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${escapeHtml(title)}</title>
<meta property="og:type" content="website">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:image" content="${escapeHtml(image)}">
<meta property="og:url" content="${escapeHtml(canonicalUrl)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(description)}">
<meta name="twitter:image" content="${escapeHtml(image)}">
<!-- Preview bots read the tags above and never render this; this refresh is
     only a safety net for the rare human who lands on this URL directly. -->
<meta http-equiv="refresh" content="0; url=${escapeHtml(canonicalUrl)}">
</head>
<body></body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=3600');
  res.status(200).send(html);
};
