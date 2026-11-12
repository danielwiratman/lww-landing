import client from '@/tina/__generated__/client';
import type {
  AboutConnectionQuery,
  AboutQuery,
  AwardsConnectionQuery,
  AwardsQuery,
  ContactConnectionQuery,
  ContactQuery,
  CustomersConnectionQuery,
  CustomersQuery,
  GlobalConnectionQuery,
  GlobalQuery,
  HomeConnectionQuery,
  HomeQuery,
  PageConnectionQuery,
  PageQuery,
  PartnersConnectionQuery,
  PartnersQuery,
  PostConnectionQuery,
  PostListingConnectionQuery,
  PostListingQuery,
  PostQuery,
  SolutionConnectionQuery,
  SolutionListingConnectionQuery,
  SolutionListingQuery,
  SolutionQuery,
} from '@/tina/__generated__/types';
import type { Locale } from './i18n';

/**
 * Every collection carries a `language` field, so a document is addressed by
 * (language, translationKey) rather than by its filename. Routing therefore
 * never breaks if an editor renames a file or flips the language field.
 *
 * The node types are taken from the generated single-document queries, which
 * describe exactly the same shape as the matching connection nodes.
 */
export type GlobalDoc = NonNullable<GlobalQuery['global']>;
export type HomeDoc = NonNullable<HomeQuery['home']>;
export type AboutDoc = NonNullable<AboutQuery['about']>;
export type ContactDoc = NonNullable<ContactQuery['contact']>;
export type CustomersDoc = NonNullable<CustomersQuery['customers']>;
export type PartnersDoc = NonNullable<PartnersQuery['partners']>;
export type AwardsDoc = NonNullable<AwardsQuery['awards']>;
export type SolutionDoc = NonNullable<SolutionQuery['solution']>;
export type SolutionListingDoc = NonNullable<SolutionListingQuery['solutionListing']>;
export type PostDoc = NonNullable<PostQuery['post']>;
export type PostListingDoc = NonNullable<PostListingQuery['postListing']>;
export type PageDoc = NonNullable<PageQuery['page']>;

/** Shape consumed by Tina's `useTina` hook for live visual editing. */
export type TinaQueryProps<T> = {
  data: T;
  variables: Record<string, unknown>;
  query: string;
};

export function toTinaProps<T>(res: {
  data: T;
  query: string;
  variables: unknown;
}): TinaQueryProps<T> {
  return {
    data: res.data,
    variables: (res.variables ?? {}) as Record<string, unknown>,
    query: res.query,
  };
}

export async function getGlobal(locale: Locale) {
  const res = await client.queries.globalConnection({
    filter: { language: { eq: locale } },
    first: 1,
  });
  return {
    res,
    doc: res.data.globalConnection.edges?.[0]?.node ?? null,
  };
}

export async function getHome(locale: Locale) {
  const res = await client.queries.homeConnection({
    filter: { language: { eq: locale }, translationKey: { eq: 'home' } },
    first: 1,
  });
  return {
    res,
    doc: res.data.homeConnection.edges?.[0]?.node ?? null,
  };
}

export async function getAbout(locale: Locale) {
  const res = await client.queries.aboutConnection({
    filter: { language: { eq: locale }, translationKey: { eq: 'about' } },
    first: 1,
  });
  return {
    res,
    doc: res.data.aboutConnection.edges?.[0]?.node ?? null,
  };
}

export async function getContact(locale: Locale) {
  const res = await client.queries.contactConnection({
    filter: { language: { eq: locale }, translationKey: { eq: 'contact' } },
    first: 1,
  });
  return {
    res,
    doc: res.data.contactConnection.edges?.[0]?.node ?? null,
  };
}

export async function getCustomers(locale: Locale) {
  const res = await client.queries.customersConnection({
    filter: { language: { eq: locale }, translationKey: { eq: 'customers' } },
    first: 1,
  });
  return {
    res,
    doc: res.data.customersConnection.edges?.[0]?.node ?? null,
  };
}

export async function getPartners(locale: Locale) {
  const res = await client.queries.partnersConnection({
    filter: { language: { eq: locale }, translationKey: { eq: 'partners' } },
    first: 1,
  });
  return {
    res,
    doc: res.data.partnersConnection.edges?.[0]?.node ?? null,
  };
}

export async function getAwards(locale: Locale) {
  const res = await client.queries.awardsConnection({
    filter: { language: { eq: locale }, translationKey: { eq: 'awards' } },
    first: 1,
  });
  return {
    res,
    doc: res.data.awardsConnection.edges?.[0]?.node ?? null,
  };
}

export async function getSolutionListing(locale: Locale) {
  const res = await client.queries.solutionListingConnection({
    filter: {
      language: { eq: locale },
      translationKey: { eq: 'solution-listing' },
    },
    first: 1,
  });
  return {
    res,
    doc: res.data.solutionListingConnection.edges?.[0]?.node ?? null,
  };
}

export async function getPostListing(locale: Locale) {
  const res = await client.queries.postListingConnection({
    filter: { language: { eq: locale }, translationKey: { eq: 'post-listing' } },
    first: 1,
  });
  return {
    res,
    doc: res.data.postListingConnection.edges?.[0]?.node ?? null,
  };
}

export async function getPage(locale: Locale, translationKey: string) {
  const res = await client.queries.pageConnection({
    filter: { language: { eq: locale }, translationKey: { eq: translationKey } },
    first: 1,
  });
  return {
    res,
    doc: res.data.pageConnection.edges?.[0]?.node ?? null,
  };
}

/** All solutions for a locale, ordered by their `order` field. */
export async function getSolutions(locale: Locale) {
  const res = await client.queries.solutionConnection({
    filter: { language: { eq: locale } },
  });
  const docs = (res.data.solutionConnection.edges ?? []).map((edge) => edge?.node).filter((node): node is SolutionDoc => Boolean(node));
  return { res, docs: [...docs].sort((a, b) => a.order - b.order) };
}

export async function getSolution(locale: Locale, slug: string) {
  const res = await client.queries.solutionConnection({
    filter: { language: { eq: locale }, slug: { eq: slug } },
    first: 1,
  });
  return {
    res,
    doc: res.data.solutionConnection.edges?.[0]?.node ?? null,
  };
}

/** All blog posts for a locale, newest first. */
export async function getPosts(locale: Locale) {
  const res = await client.queries.postConnection({
    filter: { language: { eq: locale } },
  });
  const docs = (res.data.postConnection.edges ?? []).map((edge) => edge?.node).filter((node): node is PostDoc => Boolean(node));
  return {
    res,
    docs: [...docs].sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime()),
  };
}

export async function getPost(locale: Locale, slug: string) {
  const res = await client.queries.postConnection({
    filter: { language: { eq: locale }, slug: { eq: slug } },
    first: 1,
  });
  return {
    res,
    doc: res.data.postConnection.edges?.[0]?.node ?? null,
  };
}
