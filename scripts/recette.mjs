/**
 * Recette responsive : rend chaque page aux quatre tailles du plan et vérifie
 * l'absence de débordement horizontal, de cible tactile sous 44 px et d'erreur
 * console.
 *
 * Playwright n'est pas une dépendance du projet (il n'est pas utilisé en CI) :
 *   npm install --no-save playwright
 *   npm run build && npm run preview
 *   node scripts/recette.mjs
 *
 * Utilise le Chrome installé sur la machine, aucun navigateur à télécharger.
 */
import { chromium } from 'playwright';

const BASE = 'http://localhost:4322';
const PAGES = ['/', '/archives/', '/archives/2026/', '/archives/2022/', '/news/', '/news/2026-04-10-cfp-2026/', '/mentions-legales/', '/404.html'];
const SIZES = [
  { name: 'téléphone 360×800', width: 360, height: 800 },
  { name: 'tablette portrait 768×1024', width: 768, height: 1024 },
  { name: 'tablette paysage 1024×768', width: 1024, height: 768 },
  { name: 'desktop 1440×900', width: 1440, height: 900 },
];

const browser = await chromium.launch({ channel: 'chrome' });
const problems = [];
const consoleErrors = [];

for (const size of SIZES) {
  const ctx = await browser.newContext({ viewport: { width: size.width, height: size.height } });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(`${size.name} ${page.url()}: ${m.text()}`); });
  page.on('pageerror', (e) => consoleErrors.push(`${size.name} ${page.url()}: ${e.message}`));

  for (const path of PAGES) {
    const res = await page.goto(BASE + path, { waitUntil: 'networkidle' });
    if (!res || res.status() >= 400) { problems.push(`${path} @ ${size.name}: HTTP ${res?.status()}`); continue; }

    // débordement horizontal
    const overflow = await page.evaluate(() => {
      const d = document.documentElement;
      const over = [];
      if (d.scrollWidth > d.clientWidth + 1) {
        for (const el of document.querySelectorAll('body *')) {
          const r = el.getBoundingClientRect();
          if (r.right > d.clientWidth + 1 || r.left < -1) {
            over.push(`${el.tagName.toLowerCase()}.${(el.className || '').toString().slice(0, 40)} (right=${Math.round(r.right)})`);
            if (over.length > 2) break;
          }
        }
        return { scroll: d.scrollWidth, client: d.clientWidth, culprits: over };
      }
      return null;
    });
    if (overflow) problems.push(`${path} @ ${size.name}: débordement ${overflow.scroll}>${overflow.client}px — ${overflow.culprits.join('; ')}`);

    // cibles tactiles trop petites
    const small = await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll('a, button, summary')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        // WCAG 2.5.8 dispense les liens inline dans un bloc de texte courant.
        if (el.closest('p, dd, li.prose-ese, .prose-ese')) continue;
        // Lien d'évitement : masqué au repos, pleine taille au focus.
        if (el.classList.contains('sr-only')) continue;
        if (r.height < 44 - 0.5) out.push(`${el.tagName.toLowerCase()} "${(el.textContent || '').trim().slice(0, 28)}" h=${Math.round(r.height)}`);
      }
      return out.slice(0, 4);
    });
    if (small.length) problems.push(`${path} @ ${size.name}: cible < 44px — ${small.join('; ')}`);
  }
  await ctx.close();
}

await browser.close();
console.log(`${PAGES.length} pages × ${SIZES.length} tailles = ${PAGES.length * SIZES.length} rendus`);
console.log(problems.length ? 'PROBLEMES:\n' + problems.map((p) => '  - ' + p).join('\n') : '  aucun débordement, aucune cible tactile trop petite');
console.log(consoleErrors.length ? 'ERREURS CONSOLE:\n' + [...new Set(consoleErrors)].map((p) => '  - ' + p).join('\n') : '  aucune erreur console');
