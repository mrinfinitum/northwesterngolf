import { socialLinks } from "@/config/site";
import { socialIcons } from "@/components/ui/icons";

export function SocialLinks({ className }: { className?: string }) {
  return (
    <ul className={`social-links${className ? ` ${className}` : ""}`}>
      {socialLinks.map((link) => {
        const Icon = socialIcons[link.network];
        return (
          <li key={link.network}>
            <a aria-label={`Follow on ${link.label}`} href={link.href} rel="noopener" target="_blank">
              <Icon />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
