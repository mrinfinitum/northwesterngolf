import Link from "next/link";
import { footerGroups } from "@/config/site";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "@/components/ui/icons";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <Logo />
          <div className="social-links">
            <a aria-label="Northwestern Golf on Instagram" href="https://www.instagram.com/northwesterngolf/" rel="noreferrer" target="_blank"><InstagramIcon /></a>
            <a aria-label="Northwestern Golf on Facebook" href="https://www.facebook.com/northwesterngolf/" rel="noreferrer" target="_blank"><FacebookIcon /></a>
            <a aria-label="Northwestern Golf on TikTok" href="https://www.tiktok.com/@northwesterngolf" rel="noreferrer" target="_blank"><TikTokIcon /></a>
          </div>
        </div>
        <div className="site-footer__groups">
          {footerGroups.map((group) => (
            <section key={group.heading}>
              <h2>{group.heading}</h2>
              <ul>
                {group.links.map((link) => (
                  <li key={link.href}><Link href={link.href}>{link.label}</Link></li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
      <div className="site-footer__legal">
        <p>© {new Date().getFullYear()} Northwestern Golf. All rights reserved.</p>
      </div>
      <p aria-hidden="true" className="site-footer__wordmark">Northwestern</p>
    </footer>
  );
}
