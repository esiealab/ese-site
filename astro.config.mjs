// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://ese.esiea.fr',
  trailingSlash: 'always',
  integrations: [sitemap()],
  // La CSP interdit les styles inline : Astro doit toujours émettre des .css
  // externes, jamais un <style> dans le head.
  build: { inlineStylesheets: 'never' },
  vite: {
    plugins: [tailwindcss()],
    // assetsInlineLimit: 0 empêche aussi Vite d'inliner le JS des pages, que la
    // CSP (`script-src 'self'`) refuserait.
    build: { assetsInlineLimit: 0 },
  },
  redirects: {
    '/editions/': '/archives/',
    '/editions/[year]': '/archives/[year]',
  },
});
