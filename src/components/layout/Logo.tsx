import Image from "next/image";
import Link from "next/link";

export const LOGO_URL = "https://cdn.shopify.com/s/files/1/0728/0869/3923/files/northwestern-logo.svg?v=1765076945";
const LOGO_LIGHT_URL = "https://cdn.shopify.com/s/files/1/0728/0869/3923/files/New-Northwestern-light-rs-logo.webp?v=1760615019";

export function Logo() {
  return (
    <Link aria-label="Northwestern Golf × John Daly, home" className="site-header__logo" href="/">
      <span className="site-header__wordmark">
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
      </span>
      {/* Orange brush-stroke X between the wordmark and the caricature. */}
      <img alt="" aria-hidden="true" className="site-header__cross" height={100} src="/images/brush-x.svg" width={100} />
      {/* John Daly caricature: line art in black, or white on transparent headers. */}
      {/* Shown 44–60px tall; the optimizer serves a small WebP instead of the 200px PNG. */}
      <Image alt="" className="site-header__daly" height={254} loading="eager" sizes="48px" src="/images/daly/jd-caricature-sm.png" width={200} />
      <Image
        alt=""
        className="site-header__daly site-header__daly--transparent"
        height={254}
        sizes="48px"
        src="/images/daly/jd-caricature-white-sm.png"
        width={200}
      />
    </Link>
  );
}
