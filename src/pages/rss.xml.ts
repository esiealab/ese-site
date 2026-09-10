import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { getSite } from '../lib/content';

export async function GET(context: APIContext) {
  const site = await getSite();
  const news = (await getCollection('news')).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );

  return rss({
    title: site.name,
    description: site.tagline,
    site: context.site!,
    trailingSlash: true,
    items: news.map((entry) => ({
      title: entry.data.title,
      pubDate: entry.data.date,
      link: `/news/${entry.id}/`,
    })),
    customData: '<language>fr-fr</language>',
  });
}
