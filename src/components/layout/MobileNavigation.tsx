"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { primaryNavigation } from "@/config/site";
import { AccountIcon, CloseIcon, FacebookIcon, InstagramIcon, MenuIcon, TikTokIcon } from "@/components/ui/icons";

export function MobileNavigation() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        aria-controls="mobile-menu"
        aria-expanded={open}
        aria-label="Open menu"
        className="icon-button mobile-menu-trigger"
        onClick={() => setOpen(true)}
        type="button"
      >
        <MenuIcon />
      </button>
      {open ? (
        <div className="drawer-layer">
          <button
            aria-label="Close menu"
            className="drawer-layer__backdrop"
            onClick={() => setOpen(false)}
            type="button"
          />
          <aside aria-label="Mobile navigation" className="mobile-drawer" id="mobile-menu">
            <div className="mobile-drawer__header">
              <span>Menu</span>
              <button
                aria-label="Close menu"
                className="icon-button"
                onClick={() => setOpen(false)}
                type="button"
              >
                <CloseIcon />
              </button>
            </div>
            <nav>
              <Link className="mobile-drawer__home" href="/" onClick={() => setOpen(false)}>
                Home
              </Link>
              {primaryNavigation.map((item) => (
                <details key={item.label} open={!item.children}>
                  {item.children ? (
                    <summary>{item.label}</summary>
                  ) : (
                    <Link href={item.href} onClick={() => setOpen(false)}>
                      {item.label}
                    </Link>
                  )}
                  {item.children ? (
                    <div className="mobile-drawer__children">
                      <Link href={item.href} onClick={() => setOpen(false)}>
                        Shop all {item.label}
                      </Link>
                      {item.children.map((child) => (
                        <Link href={child.href} key={child.href} onClick={() => setOpen(false)}>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </details>
              ))}
            </nav>
            <div className="mobile-drawer__meta">
              <Link className="mobile-drawer__account" href="https://northwestern.golf/customer_authentication/redirect?locale=en&region_country=US" onClick={() => setOpen(false)}>
                <AccountIcon /> Account
              </Link>
              <div className="mobile-drawer__socials">
                <a aria-label="Instagram" href="https://www.instagram.com/northwesterngolf/" rel="noreferrer" target="_blank"><InstagramIcon /></a>
                <a aria-label="Facebook" href="https://www.facebook.com/northwesterngolf/" rel="noreferrer" target="_blank"><FacebookIcon /></a>
                <a aria-label="TikTok" href="https://www.tiktok.com/@northwesterngolf" rel="noreferrer" target="_blank"><TikTokIcon /></a>
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
