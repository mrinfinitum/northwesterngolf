import { accountUrl } from "@/config/site";
import { AccountIcon } from "@/components/ui/icons";
import { isRetailCartEnabled } from "@/lib/shopify/commerce-boundary";
import { getMainNavigation } from "@/lib/shopify/navigation";
import { CartButton } from "./CartButton";
import { DesktopNavigation } from "./DesktopNavigation";
import { HeaderFrame } from "./HeaderFrame";
import { Logo } from "./Logo";
import { MobileNavigation } from "./MobileNavigation";
import { SearchShell } from "./SearchShell";

export async function Header() {
  const navigation = await getMainNavigation();

  return (
    <HeaderFrame>
      <div className="site-header__wrapper">
        <div className="site-header__main-nav">
          <div className="site-header__icons site-header__icons--leading">
            <MobileNavigation items={navigation} />
            <SearchShell className="site-header__search-mobile" />
          </div>
          <DesktopNavigation items={navigation} />
        </div>
        <Logo />
        <div className="site-header__icons site-header__secondary-nav">
          <SearchShell className="site-header__search-desktop" />
          <a aria-label="Login" className="header-icon site-header__account" href={accountUrl}>
            <AccountIcon />
          </a>
          <CartButton enabled={isRetailCartEnabled()} />
        </div>
      </div>
    </HeaderFrame>
  );
}
