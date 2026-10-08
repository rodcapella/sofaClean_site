import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
// Optional test tooling can be resolved from an existing package.json without production dependencies.
const testRequire = createRequire(process.env.GOOGLE_REVIEWS_TEST_PACKAGE || import.meta.url);
const { chromium } = testRequire('@playwright/test');
const { createServer } = await import(pathToFileURL(testRequire.resolve('vite')).href);
const appRequire = createRequire(import.meta.url);
const server = await createServer({ configFile: false,
  root: fileURLToPath(new URL('.', import.meta.url)),
  resolve: { alias: [
    { find: /^react$/, replacement: appRequire.resolve('react') },
    { find: /^react\/jsx-runtime$/, replacement: appRequire.resolve('react/jsx-runtime') },
    { find: /^react\/jsx-dev-runtime$/, replacement: appRequire.resolve('react/jsx-dev-runtime') },
    { find: /^react-dom\/client$/, replacement: appRequire.resolve('react-dom/client') },
  ] }, esbuild: { jsx: 'automatic' },
  server: { host: '127.0.0.1', port: 4201, strictPort: true,
    fs: { allow: [fileURLToPath(new URL('../../../..', import.meta.url))] } },
});
await server.listen();
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const base = 'http://127.0.0.1:4201';
const current = new Date().toISOString();
const snapshot = { source: 'Google', googleUrl: 'https://share.google/example', fetchedAt: current,
  averageRating: 4.7, totalReviewCount: 23, reviews: [{ id: 'a', author: 'Cliente de teste', rating: 3,
    comment: '<img src=x onerror="window.__injected=true">\nTexto completo', createTime: current, updateTime: current }] };
let passed = 0;
async function check(name, data, { status = 200, query = '', run } = {}) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  let requests = 0;
  await page.route('**/api/google-reviews', route => { requests++; return route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(data) }); });
  await page.goto(`${base}/${query}`);
  await page.waitForFunction(() => document.querySelector('#root main'));
  if (!query.includes('disabled')) await page.waitForFunction(() => document.querySelector('section') || document.querySelector('#root main')?.childElementCount === 0);
  await run(page, () => requests);
  assert.deepEqual(errors, []);
  console.log(`PASS ${name}`); passed++;
  await page.close();
}
try {
  await check('mobile widget, unaltered text, accessible rating, Google aggregate, no HTML execution', snapshot, { run: async page => {
    await page.getByText('Cliente de teste', { exact: true }).waitFor();
    assert.equal(await page.locator('blockquote').textContent(), snapshot.reviews[0].comment);
    assert.equal(await page.locator('blockquote img').count(), 0);
    assert.equal(await page.locator('[aria-label="3 em 5 estrelas"]').count(), 1);
    assert.equal(await page.getByText('4,7/5', { exact: true }).count(), 1);
    assert.equal(await page.getByRole('link', { name: 'Ver todas no Google' }).getAttribute('href'), snapshot.googleUrl);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  } });
  await check('empty profile displays genuine empty state', { ...snapshot, reviews: [], totalReviewCount: 0, averageRating: null }, { run: async page => {
    await page.getByText('Ainda não existem avaliações publicadas.').waitFor();
    assert.equal(await page.locator('figure').count(), 0);
  } });
  await check('unavailable API does not display invented empty state or scores', {}, { status: 503, run: async page => {
    await page.waitForTimeout(300); assert.equal(await page.locator('section').count(), 0);
  } });
  await check('expired snapshot is rejected', { ...snapshot, fetchedAt: new Date(Date.now() - 86400001).toISOString() }, { run: async page => {
    await page.waitForTimeout(300); assert.equal(await page.locator('section').count(), 0);
  } });
  await check('disabled feature makes no API request', snapshot, { query: '?disabled', run: async (page, requests) => {
    await page.waitForTimeout(300); assert.equal(requests(), 0); assert.equal(await page.locator('section').count(), 0);
  } });
  await check('multiple widgets have distinct labelled headings', snapshot, { query: '?two', run: async page => {
    await page.getByRole('heading', { name: 'Segunda instância' }).waitFor();
    const ids = await page.locator('section').evaluateAll(sections => sections.map(section => section.getAttribute('aria-labelledby')));
    assert.equal(ids.length, 2); assert.equal(new Set(ids).size, 2);
  } });
  console.log(`${passed} browser checks passed`);
} finally { await browser.close(); await server.close(); }
