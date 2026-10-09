'use strict';
const http = require('node:http');
const crypto = require('node:crypto');
const path = require('node:path');
const cfg = require('./src/config');
const { q, seedCategories, seedFromZip, settings } = require('./src/db');
const sec = require('./src/security');
const { sendFile, safeJoin, sendText } = require('./src/static');
const { handleApi } = require('./src/api');
const R = require('./src/render');
const P = require('./src/pages');

// ---------- Initialisation ----------
seedCategories();
if (seedFromZip()) console.log('✔ Contenu initial importé depuis le ZIP (projets, photos, partenaires).');
if (!q.get('SELECT 1 x FROM users LIMIT 1')) {
  const email = cfg.ADMIN_EMAIL || settings().contact.email || 'admin@etimarki.local';
  let pw = cfg.ADMIN_PASSWORD, generated = false;
  if (!pw || sec.checkPasswordPolicy(pw)) { if (pw) console.warn('⚠ ADMIN_PASSWORD trop faible (10 caractères min., lettres + chiffres) : un mot de passe aléatoire est généré.'); pw = crypto.randomBytes(9).toString('base64url') + '7a'; generated = true; }
  q.run("INSERT INTO users(email,name,password_hash,role) VALUES(?,?,?, 'admin')", email, 'Administrateur', sec.hashPassword(pw));
  console.log('\n════════════════════════════════════════════════');
  console.log(' Compte administrateur créé');
  console.log('   E-mail       :', email);
  if (generated) console.log('   Mot de passe :', pw, '\n   (affiché une seule fois — changez-le dès la première connexion)');
  console.log('════════════════════════════════════════════════\n');
}

const ROUTES = [
  [/^\/$/, (c) => P.home(c)], [/^\/a-propos$/, (c) => P.about(c)], [/^\/projets$/, (c) => P.projectsPage(c)],
  [/^\/projets\/([a-z0-9-]+)$/, (c, m) => P.projectPage(c, m[1])], [/^\/actions$/, (c) => P.actionsPage(c)], [/^\/actualites$/, (c) => P.newsPage(c)],
  [/^\/actualites\/([a-z0-9-]+)$/, (c, m) => P.newsArticle(c, m[1])], [/^\/galerie$/, (c) => P.galleryPage(c)], [/^\/videos$/, (c) => P.videosPage(c)],
  [/^\/partenaires$/, (c) => P.partnersPage(c)], [/^\/soutenir$/, (c) => P.supportPage(c)], [/^\/contact$/, (c, m, u) => P.contactPage(c, u.searchParams)],
];
const baseUrl = (req) => cfg.SITE_URL || `${sec.isHttps(req) ? 'https' : 'http'}://${req.headers.host}`;

function sendHtml(req, res, status, html) {
  const etag = 'W/"' + crypto.createHash('md5').update(html).digest('hex') + '"';
  if (status === 200 && req.headers['if-none-match'] === etag) { res.statusCode = 304; res.setHeader('ETag', etag); return res.end(); }
  sendText(req, res, status, 'text/html; charset=utf-8', html, { 'Cache-Control': status === 200 ? 'public, max-age=0, must-revalidate' : 'no-store', ETag: etag });
}

function sitemap(req) {
  const b = baseUrl(req); const urls = [['/', 1.0], ['/a-propos', 0.8], ['/projets', 0.9], ['/actions', 0.7], ['/actualites', 0.7], ['/galerie', 0.6], ['/videos', 0.5], ['/partenaires', 0.6], ['/soutenir', 0.8], ['/contact', 0.7]]
    .map(([p, pr]) => ({ loc: p, pr }));
  for (const p of q.all('SELECT slug,updated_at FROM projects WHERE published=1')) urls.push({ loc: '/projets/' + p.slug, pr: 0.8, mod: p.updated_at });
  for (const n of q.all('SELECT slug,updated_at FROM news WHERE published=1')) urls.push({ loc: '/actualites/' + n.slug, pr: 0.6, mod: n.updated_at });
  const langs = R.LANGS;
  const out = [];
  for (const l of langs) for (const u of urls) out.push(`<url><loc>${b}${l === R.MAIN ? '' : '/' + l}${u.loc === '/' && l !== R.MAIN ? '' : u.loc}</loc>${u.mod ? `<lastmod>${u.mod.slice(0, 10)}</lastmod>` : ''}<priority>${u.pr}</priority></url>`);
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${out.join('')}</urlset>`;
}

const server = http.createServer(async (req, res) => {
  const t0 = Date.now();
  try {
    sec.securityHeaders(req, res);
    const ip = sec.clientIp(req);
    const u = new URL(req.url, 'http://x'); let pathname = u.pathname;
    if (pathname.length > 1 && pathname.endsWith('/')) { res.statusCode = 301; res.setHeader('Location', pathname.replace(/\/+$/, '') + u.search); return res.end(); }
    if (pathname.startsWith('/api/')) return await handleApi(req, res, pathname, ip);
    if (!['GET', 'HEAD'].includes(req.method)) { res.statusCode = 405; res.setHeader('Allow', 'GET, HEAD'); return res.end('Méthode non autorisée'); }
    const long = 'public, max-age=31536000, immutable';

    if (pathname === '/admin') { res.setHeader('X-Robots-Tag', 'noindex, nofollow'); return sendFile(req, res, path.join(cfg.PUBLIC_DIR, 'admin', 'index.html'), { cache: 'no-store' }); }
    if (pathname === '/healthz') { q.get('SELECT 1 x'); res.setHeader('Content-Type', 'text/plain'); return res.end('ok'); }
    if (pathname === '/robots.txt') return sendText(req, res, 200, 'text/plain; charset=utf-8', `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${baseUrl(req)}/sitemap.xml\n`, { 'Cache-Control': 'public, max-age=3600' });
    if (pathname === '/sitemap.xml') return sendText(req, res, 200, 'application/xml; charset=utf-8', sitemap(req), { 'Cache-Control': 'public, max-age=3600' });
    if (pathname === '/manifest.webmanifest') {
      const o = settings().org;
      return sendText(req, res, 200, 'application/manifest+json', JSON.stringify({ name: o.name, short_name: o.short, description: settings().seo.description, lang: 'fr', start_url: '/', display: 'standalone', background_color: '#fbf8f1', theme_color: '#0b4f22',
        icons: [{ src: '/media/logo/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/media/logo/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' }] }), { 'Cache-Control': 'public, max-age=86400' });
    }
    if (pathname.startsWith('/uploads/')) { const f = safeJoin(cfg.UPLOAD_DIR, pathname.slice('/uploads'.length)); if (f && sendFile(req, res, f, { cache: long })) return; res.statusCode = 404; return res.end('Introuvable'); }
    if (/^\/(css|js|fonts|media|admin)\//.test(pathname)) {
      const f = safeJoin(cfg.PUBLIC_DIR, pathname);
      const cache = pathname.startsWith('/admin/') ? 'no-cache' : (u.searchParams.has('v') || /^\/(fonts|media)\//.test(pathname) ? long : 'public, max-age=3600');
      if (f && sendFile(req, res, f, { cache })) return;
      res.statusCode = 404; return res.end('Introuvable');
    }

    // Langue : préfixe /xx uniquement pour les langues activées autres que la principale
    let lang = R.MAIN;
    const lm = /^\/([a-z]{2})(\/.*)?$/.exec(pathname);
    if (lm && lm[1] !== R.MAIN && R.LANGS.includes(lm[1])) { lang = lm[1]; pathname = lm[2] || '/'; }
    const ctx = R.makeCtx(lang, pathname); ctx.route = pathname;
    for (const [re, fn] of ROUTES) {
      const m = re.exec(pathname); if (!m) continue;
      const html = fn(ctx, m, u); if (html) return sendHtml(req, res, 200, html); break;
    }
    return sendHtml(req, res, 404, P.notFound(ctx));
  } catch (e) {
    console.error('[ERREUR]', req.method, req.url, e);
    if (!res.headersSent) { res.statusCode = 500; res.setHeader('Content-Type', 'text/plain; charset=utf-8'); res.end('Erreur interne du serveur.'); } else res.end();
  } finally { if (process.env.LOG_REQUESTS === '1') console.log(req.method, req.url, res.statusCode, Date.now() - t0 + 'ms'); }
});
server.headersTimeout = 30000; server.requestTimeout = 10 * 60 * 1000; server.keepAliveTimeout = 5000;
server.listen(cfg.PORT, cfg.HOST, () => console.log(`ETIMARKI — site prêt sur http://localhost:${cfg.PORT}  (administration : /admin)`));
process.on('unhandledRejection', (e) => console.error('[unhandledRejection]', e));
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => server.close(() => process.exit(0)));
