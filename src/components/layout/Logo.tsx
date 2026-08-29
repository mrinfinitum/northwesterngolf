import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link
      aria-label="Northwestern Golf home"
      className="brand-logo"
      href="/"
    >
      <Image
        alt="Northwestern Golf"
        className="brand-logo__default"
        height={37}
        priority
        sizes="(min-width: 1150px) 200px, 150px"
        src="https://cdn.shopify.com/s/files/1/0728/0869/3923/files/northwestern-logo.svg?v=1765076945"
        width={426}
      />
      <Image
        alt=""
        aria-hidden="true"
        className="brand-logo__transparent"
        height={28}
        priority
        sizes="(min-width: 700px) 200px, 150px"
        src="https://cdn.shopify.com/s/files/1/0728/0869/3923/files/New-Northwestern-light-rs-logo.webp?v=1760615019"
        width={220}
      />
    </Link>
  );
}
