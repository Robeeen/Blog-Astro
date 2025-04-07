import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export const GET: APIRoute = async ({ url }): Promise<Response> => {
  const query: string | null = url.searchParams.get('query');

  // Handle if query is not present
  if (query === null) {
    return new Response(
      JSON.stringify({
        error: 'Query param is missing',
      }),
      {
        status: 400, // Bad request
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  const allBlogArticles: CollectionEntry<'blog'>[] = await getCollection(
    'blog'
  );

  // Filter articles based on query
  
  const searchResults = allBlogArticles.filter((article) => {

    const safeQuery = query?.toLowerCase() || "";
    const titleMatch: boolean = article.data.title
      .includes(safeQuery);

    const bodyMatch: boolean = article.body
      .includes(safeQuery);

    const slugMatch: boolean = article.slug
      .includes(safeQuery);

    return titleMatch || bodyMatch || slugMatch;
  });

  return new Response(JSON.stringify(searchResults), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
