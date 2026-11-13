"use client";

import { useEffect, type ReactNode } from "react";
import { trackEcommerce, type ListItems } from "@/lib/analytics";

type ItemListTrackerProps = {
  children: ReactNode;
  items: ListItems;
  listId: string;
  listName: string;
};

/**
 * GA4 view_item_list when a product list renders, and select_item when a product
 * link inside it is clicked. Renders no box of its own (display: contents).
 */
export function ItemListTracker({ children, items, listId, listName }: ItemListTrackerProps) {
  const listKey = items.map((entry) => entry.handle).join(",");

  useEffect(() => {
    if (!items.length) return;
    const list = { item_list_id: listId, item_list_name: listName };
    trackEcommerce(
      "view_item_list",
      items[0].currency,
      items.map((entry) => ({ ...entry.item, ...list })),
      list,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once per distinct list
  }, [listId, listKey]);

  function onClickCapture(event: React.MouseEvent<HTMLDivElement>) {
    const link = (event.target as Element).closest<HTMLAnchorElement>("a[href*='/products/']");
    if (!link) return;
    const handle = new URL(link.href).pathname.split("/products/")[1]?.split("/")[0];
    const entry = items.find((candidate) => candidate.handle === handle);
    if (!entry) return;
    const list = { item_list_id: listId, item_list_name: listName };
    trackEcommerce("select_item", entry.currency, [{ ...entry.item, ...list }], list);
  }

  return (
    <div onClickCapture={onClickCapture} style={{ display: "contents" }}>
      {children}
    </div>
  );
}
