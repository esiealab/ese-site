import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

/**
 * Feuille de style des couleurs de thématiques, générée depuis les données.
 * Un attribut `style` inline serait refusé par la CSP (`style-src 'self'`), et
 * coder les couleurs en dur obligerait à toucher au CSS à chaque édition.
 */
export const GET: APIRoute = async () => {
  const editions = await getCollection('editions');
  const rules: string[] = [];

  for (const edition of editions) {
    for (const track of edition.data.tracks ?? []) {
      rules.push(`[data-track="${edition.data.year}-${track.id}"]{--track-color:${track.color}}`);
    }
  }

  return new Response(rules.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/css; charset=utf-8' },
  });
};
