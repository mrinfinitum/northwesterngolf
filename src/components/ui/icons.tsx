import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const defaults = {
  "aria-hidden": true,
  fill: "none",
  focusable: false,
  height: 24,
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeWidth: 1.7,
  viewBox: "0 0 24 24",
  width: 24,
};

const filled = { "aria-hidden": true, fill: "currentColor", focusable: false, height: 27, viewBox: "0 0 24 24", width: 27 };

export function MenuIcon(props: IconProps) {
  return <svg {...defaults} height={22} strokeWidth={2} viewBox="0 0 22 22" width={22} {...props}><path d="M1 5h20M1 11h20M1 17h20" /></svg>;
}

export function CloseIcon(props: IconProps) {
  return <svg {...defaults} height={19} strokeLinecap="butt" strokeWidth={2} width={19} {...props}><path d="M17.658 6.343 6.344 17.657M17.658 17.657 6.344 6.343" /></svg>;
}

export function SearchIcon(props: IconProps) {
  return <svg {...defaults} height={22} strokeWidth={2} viewBox="0 0 22 22" width={22} {...props}><circle cx="11" cy="10" r="7" /><path d="m16 15 3 3" /></svg>;
}

export function AccountIcon(props: IconProps) {
  return <svg {...defaults} height={22} strokeWidth={2} viewBox="0 0 22 22" width={22} {...props}><circle cx="11" cy="7" r="4" /><path d="M3.5 19c1.421-2.974 4.247-5 7.5-5s6.079 2.026 7.5 5" /></svg>;
}

export function BagIcon(props: IconProps) {
  return <svg {...defaults} height={22} strokeWidth={2} viewBox="0 0 22 22" width={22} {...props}><path d="M11 7H3.577A2 2 0 0 0 1.64 9.497l2.051 8A2 2 0 0 0 5.63 19H16.37a2 2 0 0 0 1.937-1.503l2.052-8A2 2 0 0 0 18.422 7H11Zm0 0V1" /></svg>;
}

export function ChevronDownIcon(props: IconProps) {
  return <svg {...defaults} height={7} strokeLinecap="butt" strokeLinejoin="miter" strokeWidth={2} viewBox="0 0 10 7" width={10} {...props}><path d="m1 1 4 4 4-4" /></svg>;
}

export function ChevronLeftSmallIcon(props: IconProps) {
  return <svg {...defaults} height={10} strokeLinecap="butt" strokeLinejoin="miter" strokeWidth={2} viewBox="0 0 7 10" width={7} {...props}><path d="M6 1 2 5l4 4" /></svg>;
}

export function ChevronRightSmallIcon(props: IconProps) {
  return <svg {...defaults} height={8} strokeLinecap="butt" strokeLinejoin="miter" strokeWidth={1.5} viewBox="0 0 5 8" width={5} {...props}><path d="m.75 7 3-3-3-3" /></svg>;
}

export function ChevronLeftIcon(props: IconProps) {
  return <svg {...defaults} {...props}><path d="m15 18-6-6 6-6" /></svg>;
}

export function ChevronRightIcon(props: IconProps) {
  return <svg {...defaults} {...props}><path d="m9 18 6-6-6-6" /></svg>;
}

export function FacebookIcon(props: IconProps) {
  return <svg {...filled} {...props}><path clipRule="evenodd" d="M10.183 21.85v-8.868H7.2V9.526h2.983V6.982a4.17 4.17 0 0 1 4.44-4.572 22.33 22.33 0 0 1 2.667.144v3.084h-1.83a1.44 1.44 0 0 0-1.713 1.68v2.208h3.423l-.447 3.456h-2.97v8.868h-3.57Z" fillRule="evenodd" /></svg>;
}

export function InstagramIcon(props: IconProps) {
  return <svg {...filled} {...props}><path clipRule="evenodd" d="M12 2.4c-2.607 0-2.934.011-3.958.058-1.022.046-1.72.209-2.33.446a4.705 4.705 0 0 0-1.7 1.107 4.706 4.706 0 0 0-1.108 1.7c-.237.611-.4 1.31-.446 2.331C2.41 9.066 2.4 9.392 2.4 12c0 2.607.011 2.934.058 3.958.046 1.022.209 1.72.446 2.33a4.706 4.706 0 0 0 1.107 1.7c.534.535 1.07.863 1.7 1.108.611.237 1.309.4 2.33.446 1.025.047 1.352.058 3.959.058s2.934-.011 3.958-.058c1.022-.046 1.72-.209 2.33-.446a4.706 4.706 0 0 0 1.7-1.107 4.706 4.706 0 0 0 1.108-1.7c.237-.611.4-1.31.446-2.33.047-1.025.058-1.352.058-3.959s-.011-2.934-.058-3.958c-.047-1.022-.209-1.72-.446-2.33a4.706 4.706 0 0 0-1.107-1.7 4.705 4.705 0 0 0-1.7-1.108c-.611-.237-1.31-.4-2.331-.446C14.934 2.41 14.608 2.4 12 2.4Zm0 1.73c2.563 0 2.867.01 3.88.056.935.042 1.443.199 1.782.33.448.174.768.382 1.104.718.336.336.544.656.718 1.104.131.338.287.847.33 1.783.046 1.012.056 1.316.056 3.879 0 2.563-.01 2.867-.056 3.88-.043.935-.199 1.444-.33 1.782a2.974 2.974 0 0 1-.719 1.104 2.974 2.974 0 0 1-1.103.718c-.339.131-.847.288-1.783.33-1.012.046-1.316.056-3.88.056-2.563 0-2.866-.01-3.878-.056-.936-.042-1.445-.199-1.783-.33a2.974 2.974 0 0 1-1.104-.718 2.974 2.974 0 0 1-.718-1.104c-.131-.338-.288-.847-.33-1.783-.047-1.012-.056-1.316-.056-3.879 0-2.563.01-2.867.056-3.88.042-.935.199-1.443.33-1.782.174-.448.382-.768.718-1.104a2.974 2.974 0 0 1 1.104-.718c.338-.131.847-.288 1.783-.33C9.133 4.14 9.437 4.13 12 4.13Zm0 11.07a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4Zm0-8.13a4.93 4.93 0 1 0 0 9.86 4.93 4.93 0 0 0 0-9.86Zm6.276-.194a1.152 1.152 0 1 1-2.304 0 1.152 1.152 0 0 1 2.304 0Z" fillRule="evenodd" /></svg>;
}

export function TikTokIcon(props: IconProps) {
  return <svg {...filled} {...props}><path d="M20.027 10.168a5.125 5.125 0 0 1-4.76-2.294v7.893a5.833 5.833 0 1 1-5.834-5.834c.122 0 .241.011.361.019v2.874c-.12-.014-.237-.036-.36-.036a2.977 2.977 0 0 0 0 5.954c1.644 0 3.096-1.295 3.096-2.94L12.56 2.4h2.75a5.122 5.122 0 0 0 4.72 4.573v3.195" /></svg>;
}

export const socialIcons = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
} as const;
