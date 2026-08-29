import Link from "next/link";
import { primaryNavigation } from "@/config/site";
import { ChevronDownIcon } from "@/components/ui/icons";

export function DesktopNavigation() {
  return (
    <nav aria-label="Primary navigation" className="desktop-navigation">
      <ul>
        {primaryNavigation.map((item) => (
          <li className="desktop-navigation__item" key={item.label}>
            <Link href={item.href}>
              {item.label}
              {item.children ? <ChevronDownIcon height={7} width={10} /> : null}
            </Link>
            {item.children ? (
              <div className="desktop-navigation__dropdown">
                <ul>
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <Link href={child.href}>{child.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </nav>
  );
}
