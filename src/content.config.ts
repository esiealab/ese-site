import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;
const time = (label: string) => z.string().regex(HHMM, `${label} attendu au format HH:MM`);

const site = defineCollection({
  // Singleton : la clé racine `site:` du YAML devient l'id de l'unique entrée.
  loader: file('src/content/site.yaml'),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    email: z.email(),
    social: z.array(z.object({ name: z.string(), url: z.url() })),
    organizer: z.object({ name: z.string(), url: z.url() }),
    currentEdition: z.number().int(),
    firstEdition: z.number().int(),
    history: z.string(),
  }),
});

const track = z.object({
  id: z.string(),
  label: z.string(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'couleur attendue au format #rrggbb'),
});

const kidsProgramme = z.object({
  ageRange: z.string(),
  sessions: z.array(z.object({ label: z.string(), start: time('start'), end: time('end') })),
  intro: z.string(),
  ticketUrl: z.url().optional(),
  gift: z.string().optional(),
});

const editions = defineCollection({
  loader: glob({ base: 'src/content/editions', pattern: '*.yaml' }),
  schema: z
    .object({
      year: z.number().int(),
      date: z.date().optional(),
      dateEnd: z.date().optional(),
      venue: z.string().optional(),
      address: z.string().optional(),
      mapUrl: z.url().optional(),
      access: z.string().optional(),
      price: z.string().optional(),
      ticketUrl: z.url().optional(),
      slidesUrl: z.url().optional(),
      status: z.enum(['announced', 'cfp-open', 'program-published', 'past', 'archived']),
      intro: z.string().optional(),
      tracks: z.array(track).optional(),
      kids: kidsProgramme.optional(),
      volunteers: z.array(z.string()).optional(),
      programStatus: z.enum(['provisoire', 'définitif']).optional(),
    })
    // Une édition annoncée n'a pas encore forcément de date ni de lieu ; une
    // édition archivée peut n'en avoir jamais gardé la trace (2025 : lieu écrasé
    // dans l'historique git, irrécupérable). Entre les deux, les deux sont dus.
    .refine(
      (e) =>
        e.status === 'announced' ||
        e.status === 'archived' ||
        (e.date && e.venue),
      {
        message:
          'date et venue sont obligatoires pour une édition en cours de cycle ' +
          '(cfp-open, program-published, past)',
        path: ['date'],
      },
    )
    .refine((e) => !e.dateEnd || !e.date || e.dateEnd >= e.date, {
      message: 'dateEnd ne peut pas précéder date',
      path: ['dateEnd'],
    })
    .refine((e) => !e.tracks || new Set(e.tracks.map((t) => t.id)).size === e.tracks.length, {
      message: 'deux thématiques portent le même id',
      path: ['tracks'],
    }),
});

const talks = defineCollection({
  loader: glob({ base: 'src/content/talks', pattern: '*.yaml' }),
  schema: z
    .object({
      edition: reference('editions'),
      start: time('start'),
      end: time('end').optional(),
      title: z.string(),
      speakers: z.array(reference('speakers')).default([]),
      kind: z
        .enum(['talk', 'workshop', 'break', 'lunch', 'opening', 'closing'])
        .default('talk'),
      track: z.string().optional(),
      lang: z.enum(['fr', 'en']).default('fr'),
      abstract: z.string().optional(),
      slides: z.url().optional(),
      maxAttendees: z.number().int().positive().optional(),
    })
    // `track` n'est exigé que si l'édition déclare des thématiques : les archives
    // antérieures à 2026 n'en avaient pas. Vérifié par assertTracksResolve(),
    // qui voit l'édition — ce qu'un schéma zod ne peut pas faire.
    .refine((t) => !t.end || t.end > t.start, {
      message: 'end doit être postérieur à start',
      path: ['end'],
    })
    ,
});

const speakers = defineCollection({
  loader: glob({ base: 'src/content/speakers', pattern: '*.yaml' }),
  schema: z.object({
    name: z.string(),
    affiliation: z.string().optional(),
    handle: z.string().optional(),
    bio: z.string().optional(),
    photo: z.string().optional(),
    links: z
      .object({
        web: z.url().optional(),
        linkedin: z.url().optional(),
        mastodon: z.url().optional(),
        bluesky: z.url().optional(),
        github: z.url().optional(),
        twitter: z.url().optional(),
      })
      .optional(),
  }),
});

const kids = defineCollection({
  loader: glob({ base: 'src/content/kids', pattern: '*.yaml' }),
  schema: z.object({
    edition: reference('editions'),
    title: z.string(),
    emoji: z.string().optional(),
    description: z.string(),
    partner: z.object({ name: z.string(), url: z.url() }).optional(),
  }),
});

const sponsors = defineCollection({
  loader: glob({ base: 'src/content/sponsors', pattern: '*.yaml' }),
  schema: z.object({
    name: z.string(),
    // Nom du fichier dans src/assets/partners/ (pas un chemin public).
    logo: z.string(),
    url: z.url(),
    tier: z.enum(['platinum', 'gold', 'silver', 'partner']),
    editions: z.array(z.number().int()).nonempty(),
  }),
});

const news = defineCollection({
  loader: glob({ base: 'src/content/news', pattern: '*.md' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    edition: z.number().int().optional(),
    tags: z.array(z.string()).default([]),
    pinned: z.boolean().default(false),
    expires: z.date().optional(),
  }),
});

const pages = defineCollection({
  loader: glob({ base: 'src/content/pages', pattern: '*.md' }),
  schema: z.object({ title: z.string(), description: z.string().optional() }),
});

export const collections = { site, editions, talks, speakers, kids, sponsors, news, pages };
