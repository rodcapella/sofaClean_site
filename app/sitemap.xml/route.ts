export function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const urls = [['/sofaclean', '1.0'], ['/sofaclean/termos-e-condicoes', '0.6'], ['/sofaclean/privacidade', '0.6'], ['/sofaclean/politica-de-devolucoes', '0.6']];
  const today = new Date().toISOString().slice(0, 10);
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(([path, priority]) => `<url><loc>${origin}${path}</loc><lastmod>${today}</lastmod><priority>${priority}</priority></url>`).join('')}</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
