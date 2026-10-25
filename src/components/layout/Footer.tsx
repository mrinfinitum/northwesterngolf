import Image from "next/image";
import Link from "next/link";
import { getFooterNavigation } from "@/lib/shopify/navigation";
import { LOGO_URL } from "./Logo";
import { SocialLinks } from "./SocialLinks";

export async function Footer() {
  const groups = await getFooterNavigation();

  return (
    <footer className="site-footer">
      <div className="site-footer__container">
        <div className="site-footer__row site-footer__top">
          <div className="site-footer__col site-footer__brand">
            <Link aria-label="Northwestern Golf home" href="/">
              <Image alt="Northwestern Golf" height={37} src={LOGO_URL} unoptimized width={426} />
            </Link>
            <SocialLinks className="site-footer__social" />
          </div>
          {groups.map((group) => (
            <div className="site-footer__col" key={group.heading}>
              <h2 className="site-footer__heading">{group.heading}</h2>
              <ul className="site-footer__menu">
                {group.links.map((link) => (
                  <li key={link.href}><Link href={link.href}>{link.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="site-footer__row site-footer__bottom">
        <p>© {new Date().getFullYear()} Northwestern Golf. All rights reserved.</p>
      </div>
    </footer>
  );
}
