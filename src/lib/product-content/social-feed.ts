import "server-only";

/**
 * Instagram feed shown on the men's product templates. Live renders it with
 * the Instafeed (nfcube) app block, whose public feed endpoint returns
 * short-lived Instagram CDN URLs, so the feed is fetched server-side and
 * revalidated hourly instead of being mirrored statically.
 */

const INSTAFEED_ENDPOINT = "https://instafeed.nfcube.com/feed/v5";
const INSTAFEED_ACCOUNT = "r1kikk-am.myshopify.com";
const INSTAFEED_HASH = "f0c6d0d47a42e903fe36fdb84d0dc421";
const FEED_LIMIT = 18;

export type SocialPost = {
  id: string;
  /** Collaborator handle shown as an overlay when the post isn't the brand's own. */
  collaborator: string | null;
  link: string;
  poster: string;
  video: string | null;
};

type InstafeedResponse = {
  data?: Array<{
    id: string;
    images?: { standard_resolution?: { url?: string } };
    link: string;
    type: string;
    user?: { username?: string };
    videos?: { standard_resolution?: { url?: string } };
  }>;
  meta?: { username?: string };
};

export async function getSocialFeed(handle: string): Promise<SocialPost[]> {
  const url = new URL(INSTAFEED_ENDPOINT);
  url.searchParams.set("limit", String(FEED_LIMIT));
  url.searchParams.set("account", INSTAFEED_ACCOUNT);
  url.searchParams.set("fu", "0");
  url.searchParams.set("fid", "0");
  url.searchParams.set("hash", INSTAFEED_HASH);
  url.searchParams.set("locale", "en");
  url.searchParams.set("handle", handle);

  try {
    const response = await fetch(url, { next: { revalidate: 3600, tags: ["social-feed"] } });
    if (!response.ok) return [];
    const payload = (await response.json()) as InstafeedResponse;
    const owner = payload.meta?.username;
    return (payload.data ?? [])
      .map((post) => ({
        collaborator: post.user?.username && post.user.username !== owner ? `@${post.user.username}` : null,
        id: post.id,
        link: post.link,
        poster: post.images?.standard_resolution?.url ?? "",
        video: post.type === "video" ? post.videos?.standard_resolution?.url ?? null : null,
      }))
      .filter((post) => post.poster);
  } catch {
    return [];
  }
}
