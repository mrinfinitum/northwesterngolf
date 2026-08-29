import type { Metadata } from "next";

export function metadataTitle(title: string): Metadata["title"] {
  return /northwestern golf/i.test(title) ? { absolute: title } : title;
}
