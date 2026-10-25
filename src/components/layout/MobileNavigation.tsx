"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { accountUrl, type NavigationItem } from "@/config/site";
import { ChevronLeftSmallIcon, ChevronRightSmallIcon, CloseIcon, MenuIcon } from "@/components/ui/icons";
import { SocialLinks } from "./SocialLinks";
import { useDrawer } from "./use-drawer";

export function MobileNavigation({ items }: { items: NavigationItem[] }) {
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<number | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const active = panel === null ? null : items[panel];

  const close = () => {
    setOpen(false);
    setPanel(null);
  };

  useDrawer(open, close, drawerRef, triggerRef);

  useEffect(() => {
    drawerRef.current?.querySelector<HTMLElement>(".nav-drawer__panel button, .nav-drawer__panel a")?.focus();
  }, [panel]);

  return (
    <>
      <button
        aria-controls="nav-drawer"
        aria-expanded={open}
        aria-label="Menu"
        className="header-icon site-header__menu-toggle"
        onClick={() => setOpen(true)}
        ref={triggerRef}
        type="button"
      >
        <MenuIcon />
      </button>
      {open ? (
        <div className="drawer drawer--left nav-drawer" id="nav-drawer">
          <button aria-label="Close menu" className="drawer__overlay" onClick={close} tabIndex={-1} type="button" />
          <div aria-label="Menu" aria-modal="true" className="drawer__content" ref={drawerRef} role="dialog">
            <button aria-label="Close" className="drawer__close nav-drawer__close" onClick={close} type="button">
              <CloseIcon />
            </button>
            {active?.children ? (
              <div className="nav-drawer__panel nav-drawer__panel--sub" key={active.label}>
                <button className="nav-drawer__back" onClick={() => setPanel(null)} type="button">
                  <ChevronLeftSmallIcon />
                  {active.label}
                </button>
                <ul className="nav-drawer__list">
                  {active.children.map((child) => (
                    <li key={child.href}>
                      <Link className="nav-drawer__link nav-drawer__link--upper" href={child.href} onClick={close}>
                        <span className="reversed-link">{child.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="nav-drawer__panel">
                <ul className="nav-drawer__list">
                  {items.map((item, index) => (
                    <li key={item.label}>
                      {item.children ? (
                        <button className="nav-drawer__link nav-drawer__toggle" onClick={() => setPanel(index)} type="button">
                          <span>{item.label}</span>
                          <span className="circle-chevron"><ChevronRightSmallIcon /></span>
                        </button>
                      ) : item.href ? (
                        <Link className="nav-drawer__link nav-drawer__link--upper" href={item.href} onClick={close}>
                          <span className="reversed-link">{item.label}</span>
                        </Link>
                      ) : (
                        <span className="nav-drawer__link nav-drawer__link--upper">{item.label}</span>
                      )}
                    </li>
                  ))}
                </ul>
                <div className="nav-drawer__footer">
                  <SocialLinks />
                  <div className="nav-drawer__account">
                    <a href={accountUrl}>Account</a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
