import Link from "next/link";
import type { NavigationItem } from "@/config/site";
import { ChevronDownIcon } from "@/components/ui/icons";

export function DesktopNavigation({ items }: { items: NavigationItem[] }) {
  return (
    <nav aria-label="Primary navigation" className="desktop-nav">
      <ul className="desktop-nav__list">
        {items.map((item) => (
          <li className="desktop-nav__item" key={item.label}>
            {item.children ? (
              <>
                {item.href ? (
                  <Link aria-haspopup="true" className="desktop-nav__link" href={item.href}>
                    {item.label}
                    <ChevronDownIcon />
                  </Link>
                ) : (
                  <button aria-haspopup="true" className="desktop-nav__link" type="button">
                    {item.label}
                    <ChevronDownIcon />
                  </button>
                )}
                <div className="desktop-nav__dropdown">
                  <ul>
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link className="desktop-nav__dropdown-link" href={child.href}>
                          <span className="reversed-link">{child.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : item.href ? (
              <Link className="desktop-nav__link" href={item.href}>{item.label}</Link>
            ) : (
              <span className="desktop-nav__link">{item.label}</span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
