export function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const urls = ['/sofaclean', '/sofaclean/termos-e-condicoes', '/sofaclean/privacidade', '/sofaclean/politica-de-devolucoes'];
  const today = new Date().toISOString().slice(0, 10);
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(path => `<url><loc>${origin}${path}</loc><lastmod>${today}</lastmod></url>`).join('')}</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
