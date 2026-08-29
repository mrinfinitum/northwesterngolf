import Link from "next/link";
import { AccountIcon } from "@/components/ui/icons";
import { CartButton } from "./CartButton";
import { DesktopNavigation } from "./DesktopNavigation";
import { HeaderFrame } from "./HeaderFrame";
import { Logo } from "./Logo";
import { MobileNavigation } from "./MobileNavigation";
import { SearchShell } from "./SearchShell";
import { isRetailCartEnabled } from "@/lib/shopify/commerce-boundary";

export function Header() {
  return (
    <HeaderFrame>
      <div className="site-header__inner">
        <div className="site-header__main-nav">
          <div className="site-header__mobile-actions">
            <MobileNavigation />
            <div className="mobile-search-trigger"><SearchShell /></div>
          </div>
          <DesktopNavigation />
        </div>
        <Logo />
        <div className="site-header__actions">
          <div className="desktop-search-trigger"><SearchShell /></div>
          <Link
            aria-label="Customer account"
            className="icon-button account-link"
            href="https://northwestern.golf/customer_authentication/redirect?locale=en&region_country=US"
          >
            <AccountIcon />
          </Link>
          <CartButton enabled={isRetailCartEnabled()} />
        </div>
      </div>
    </HeaderFrame>
  );
}
