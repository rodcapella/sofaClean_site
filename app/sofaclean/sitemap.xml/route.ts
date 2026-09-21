export function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const escapeXml = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
  const urls = [
    ['/sofaclean', '1.0'],
    ['/sofaclean/termos-e-condicoes', '0.6'],
    ['/sofaclean/privacidade', '0.6'],
    ['/sofaclean/politica-de-devolucoes', '0.6'],
  ];
  const lastmod = new Date().toISOString().slice(0, 10);
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(([path, priority]) => `<url><loc>${escapeXml(origin + path)}</loc><lastmod>${lastmod}</lastmod><priority>${priority}</priority></url>`).join('')}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
