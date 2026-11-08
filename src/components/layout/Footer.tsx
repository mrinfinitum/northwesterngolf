import Link from "next/link";
import { getFooterNavigation } from "@/lib/shopify/navigation";
import { SocialLinks } from "./SocialLinks";

export async function Footer() {
  const groups = await getFooterNavigation();

  return (
    <footer className="site-footer">
      <div className="site-footer__container">
        <div className="site-footer__row site-footer__top">
          <div className="site-footer__col site-footer__brand">
            <Link aria-label="Northwestern Golf home" href="/">
              <span aria-hidden="true" className="site-footer__logo" />
            </Link>
            <SocialLinks className="site-footer__social" />
          </div>
          <div className="site-footer__menus">
          {groups.map((group) => (
            <div className="site-footer__col" key={group.heading}>
              <p className="site-footer__heading">{group.heading}</p>
              <ul className="site-footer__menu">
                {group.links.map((link) => (
                  <li key={link.href}><Link href={link.href}>{link.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
          </div>
        </div>
      </div>
      <div className="site-footer__row site-footer__bottom">
        <p>© {new Date().getFullYear()} Northwestern Golf. All rights reserved.</p>
      </div>
    </footer>
  );
}
