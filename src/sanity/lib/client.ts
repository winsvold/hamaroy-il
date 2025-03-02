import { createClient, QueryParams } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
});

export async function sanityFetch<const QueryString extends string>(
  query: QueryString,
  params?: QueryParams,
  options?: {
    revalidate?: number | false;
    tags?: string[];
  },
) {
  return sanityClient.fetch(query, params, {
    next: {
      revalidate: options?.tags?.length ? false : (options?.revalidate ?? 10), // for simple, time-based revalidation
      tags: options?.tags, // for tag-based revalidation
    },
  });
}
