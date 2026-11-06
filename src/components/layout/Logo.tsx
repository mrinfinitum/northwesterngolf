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
      {/* Orange X from the Northwestern × John Daly lockup. */}
      <svg aria-hidden="true" className="site-header__cross" viewBox="0 0 40 40">
        <path
          d="M8 2 20 14 32 2l6 6-12 12 12 12-6 6-12-12L8 38l-6-6 12-12L2 8Z"
          fill="#f47b2a"
          stroke="#fff"
          strokeLinejoin="round"
          strokeWidth="1.6"
        />
      </svg>
      {/* John Daly caricature: line art in black, or white on transparent headers. */}
      <img alt="" className="site-header__daly" height={203} src="/images/daly/jd-caricature-sm.png" width={160} />
      <img
        alt=""
        className="site-header__daly site-header__daly--transparent"
        height={203}
        src="/images/daly/jd-caricature-white-sm.png"
        width={160}
      />
    </Link>
  );
}
