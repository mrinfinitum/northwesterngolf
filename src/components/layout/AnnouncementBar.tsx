import Link from "next/link";
import { homepageContent } from "@/config/site";

export function AnnouncementBar() {
  return (
    <Link className="announcement-bar" href="/collections/all">
      {homepageContent.announcement}
    </Link>
  );
}
