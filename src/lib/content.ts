import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export type Edition = CollectionEntry<'editions'>;
export type Talk = CollectionEntry<'talks'>;
export type Speaker = CollectionEntry<'speakers'>;
export type KidsWorkshop = CollectionEntry<'kids'>;

const ARCHIVE_STATUSES = ['past', 'archived'] as const;

export async function getSite() {
  const entry = await getEntry('site', 'site');
  if (!entry) throw new Error('src/content/site.yaml : clé racine `site:` manquante.');
  return entry.data;
}

export async function getCurrentEdition(): Promise<Edition> {
  const { currentEdition } = await getSite();
  const edition = await getEntry('editions', String(currentEdition));
  if (!edition) {
    throw new Error(
      `site.currentEdition vaut ${currentEdition} mais src/content/editions/${currentEdition}.yaml n'existe pas.`,
    );
  }
  if (edition.data.status === 'archived') {
    throw new Error(
      `site.currentEdition vaut ${currentEdition}, or cette édition est \`archived\`. ` +
        `Annoncez l'édition suivante avant d'archiver celle-ci.`,
    );
  }
  return edition;
}

/** Toutes les éditions de /archives/ (`past` et `archived`), plus récente d'abord. */
export async function getArchivedEditions(): Promise<Edition[]> {
  const editions = await getCollection('editions', (e) =>
    ARCHIVE_STATUSES.includes(e.data.status as (typeof ARCHIVE_STATUSES)[number]),
  );
  return editions.sort((a, b) => b.data.year - a.data.year);
}

/** Bandeau « Éditions précédentes » de la home : sans l'édition courante. */
export async function getPreviousEditions(limit = 3): Promise<Edition[]> {
  const current = await getCurrentEdition();
  const editions = await getArchivedEditions();
  return editions.filter((e) => e.id !== current.id).slice(0, limit);
}

/** Programme d'une édition, trié par horaire, chevauchements signalés. */
export async function getProgramme(editionId: string): Promise<Talk[]> {
  const talks = await getCollection('talks', (t) => t.data.edition.id === editionId);
  const sorted = talks.sort((a, b) => a.data.start.localeCompare(b.data.start));

  const edition = await getEntry('editions', editionId);
  if (edition) await assertTracksResolve(edition, sorted);

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1]!.data;
    const cur = sorted[i]!.data;
    if (prev.end && cur.start < prev.end) {
      console.warn(
        `[programme ${editionId}] chevauchement : « ${prev.title} » (${prev.start}-${prev.end}) ` +
          `et « ${cur.title} » (${cur.start}).`,
      );
    }
  }
  return sorted;
}

/**
 * Cohérence des thématiques d'une édition : tout `talk.track` doit être déclaré
 * dans ses `tracks[]`, et si elle en déclare, chaque conférence doit en porter
 * une. Une édition sans `tracks[]` (les archives d'avant 2026) est exemptée.
 */
export async function assertTracksResolve(edition: Edition, talks: Talk[]): Promise<void> {
  const declared = new Set((edition.data.tracks ?? []).map((t) => t.id));
  const problems: string[] = [];

  for (const t of talks) {
    if (t.data.track && !declared.has(t.data.track)) {
      problems.push(`« ${t.data.title} » → thématique inconnue : ${t.data.track}`);
    } else if (declared.size && t.data.kind === 'talk' && !t.data.track) {
      problems.push(`« ${t.data.title} » → thématique manquante`);
    }
  }

  if (problems.length) {
    throw new Error(
      `Édition ${edition.data.year} : thématiques incohérentes.\n  ` +
        problems.join('\n  '),
    );
  }
}

/** Ateliers ESE4Kids d'une edition, dans l'ordre des fichiers. */
export async function getKidsWorkshops(editionId: string): Promise<KidsWorkshop[]> {
  const workshops = await getCollection('kids', (k) => k.data.edition.id === editionId);
  return workshops.sort((a, b) => a.id.localeCompare(b.id, 'fr'));
}

export async function getTalkSpeakers(talk: Talk): Promise<Speaker[]> {
  const entries = await Promise.all(talk.data.speakers.map((ref) => getEntry(ref)));
  return entries.filter((e): e is Speaker => Boolean(e));
}

/** News affichables : non expirées, triées par date décroissante. */
export async function getVisibleNews(now = new Date()) {
  const news = await getCollection('news', (n) => !n.data.expires || n.data.expires >= now);
  return news.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function getPinnedNews(limit = 3, now = new Date()) {
  const news = await getVisibleNews(now);
  return news.filter((n) => n.data.pinned).slice(0, limit);
}

/** Partenaires d'une édition donnée, par niveau puis par nom. */
export async function getEditionSponsors(year: number) {
  const TIERS = ['platinum', 'gold', 'silver', 'partner'];
  const sponsors = await getCollection('sponsors', (s) => s.data.editions.includes(year));
  return sponsors.sort(
    (a, b) =>
      TIERS.indexOf(a.data.tier) - TIERS.indexOf(b.data.tier) ||
      a.data.name.localeCompare(b.data.name, 'fr'),
  );
}

const DATE_LONG = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

export const formatDateLong = (d: Date) => DATE_LONG.format(d);
