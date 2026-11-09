import Image from "next/image";
import Link from "next/link";

export const LOGO_URL = "https://cdn.shopify.com/s/files/1/0728/0869/3923/files/northwestern-logo.svg?v=1765076945";
const LOGO_LIGHT_URL = "https://cdn.shopify.com/s/files/1/0728/0869/3923/files/New-Northwestern-light-rs-logo.webp?v=1760615019";

export function Logo() {
  return (
    <Link aria-label="Northwestern Golf home" className="site-header__logo" href="/">
      <Image
        alt="Northwestern Golf"
        className="site-header__logo-image"
        height={37}
        loading="eager"
        src={LOGO_URL}
        unoptimized
        width={426}
      />
      <Image
        alt=""
        aria-hidden="true"
        className="site-header__logo-image site-header__logo-image--transparent"
        height={28}
        sizes="200px"
        src={LOGO_LIGHT_URL}
        width={220}
      />
    </Link>
  );
}
