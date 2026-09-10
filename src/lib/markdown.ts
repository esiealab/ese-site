import { marked } from 'marked';

/**
 * Les champs markdown des collections YAML (`abstract`, `intro`, `access`…) ne
 * passent pas par `render()`, réservé aux entrées markdown. On les convertit
 * ici, au build : le HTML produit est statique, la CSP n'est pas concernée.
 */
marked.use({ gfm: true, breaks: false });

/** Bloc markdown complet (paragraphes, listes). */
export const md = (source: string): string => marked.parse(source, { async: false });

/** Markdown restreint à une ligne : pas de <p> autour. */
export const mdInline = (source: string): string => marked.parseInline(source, { async: false });
