import { getSocialFeed } from "@/lib/product-content/social-feed";
import { SocialFeedCarousel } from "./SocialFeedCarousel";

export async function PdpSocialFeed({ handle }: { handle: string }) {
  const posts = await getSocialFeed(handle);
  if (!posts.length) return null;
  return (
    <section aria-label="Instagram" className="nwg-pdp-social-section">
      <SocialFeedCarousel posts={posts} />
    </section>
  );
}
