"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useTransition } from "react";
import { addCartLineAction } from "@/app/cart/actions";
import { publishCartUpdate } from "@/components/cart/cart-events";
import type { Product, ProductVariant, ShopifyImage } from "@/lib/shopify";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";
import { formatMoney } from "./Money";

function optionMap(variant: ProductVariant) {
  return Object.fromEntries(variant.selectedOptions.map((option) => [option.name, option.value]));
}

const swatchColors: Record<string, string> = {
  Black: "#000000",
  Gray: "#808080",
  Green: "#05aa3d",
  Navy: "#282099",
};

export function ProductConfigurator({
  brandLine,
  campaignLabel,
  cartEnabled,
  product,
}: {
  brandLine?: string;
  campaignLabel?: string;
  cartEnabled: boolean;
  product: Product;
}) {
  const initialVariant = product.variants.find((variant) => variant.availableForSale) ?? product.variants[0];
  const [selected, setSelected] = useState<Record<string, string>>(
    initialVariant ? optionMap(initialVariant) : {},
  );
  const [quantity, setQuantity] = useState(1);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [hasSelectedVariant, setHasSelectedVariant] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const [cartMessageType, setCartMessageType] = useState<"error" | "success">("success");
  const [isAdding, startAdding] = useTransition();
  const thumbnailRailRef = useRef<HTMLDivElement>(null);
  const zoomDialogRef = useRef<HTMLDialogElement>(null);

  const variant = product.variants.find((candidate) =>
    candidate.selectedOptions.every((option) => selected[option.name] === option.value),
  ) ?? initialVariant;

  const media = !variant?.image || product.images.some((image) => image.id === variant.image?.id)
    ? product.images
    : [variant.image, ...product.images];

  const shownIndex = Math.min(activeMediaIndex, Math.max(0, media.length - 1));
  const image = media[shownIndex] ?? product.featuredImage;
  const price = variant?.price ?? product.priceRange.minVariantPrice;
  const compareAt = variant?.compareAtPrice;
  const onSale = Boolean(compareAt && Number(compareAt.amount) > Number(price.amount));

  useEffect(() => {
    if (!hasSelectedVariant || !variant) return;
    const url = new URL(window.location.href);
    url.searchParams.set("variant", variant.id.replace("gid://shopify/ProductVariant/", ""));
    window.history.replaceState({}, "", url);
  }, [hasSelectedVariant, variant]);

  useEffect(() => {
    const activeThumbnail = thumbnailRailRef.current?.querySelector<HTMLElement>(".is-active");
    activeThumbnail?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [shownIndex]);

  function chooseOption(name: string, value: string) {
    setHasSelectedVariant(true);
    const next = { ...selected, [name]: value };
    const exact = product.variants.find((candidate) =>
      candidate.selectedOptions.every((option) => next[option.name] === option.value),
    );
    const compatible = product.variants.find((candidate) =>
      candidate.selectedOptions.some((option) => option.name === name && option.value === value),
    );
    const resolved = exact ?? compatible;
    setSelected(resolved ? optionMap(resolved) : next);
    if (resolved?.image) {
      const index = media.findIndex((candidate) => candidate.id === resolved.image?.id);
      if (index >= 0) setActiveMediaIndex(index);
    }
  }

  function showMedia(index: number) {
    setActiveMediaIndex((index + media.length) % media.length);
  }

  function addToCart() {
    if (!variant || !cartEnabled || !variant.availableForSale) return;
    setCartMessage("");
    startAdding(async () => {
      const result = await addCartLineAction(variant.id, quantity);
      setCartMessage(result.message);
      setCartMessageType(result.ok ? "success" : "error");
      if (result.ok && result.cart) {
        publishCartUpdate(result.cart, true, result.message);
      }
    });
  }

  return (
    <div className="product-configurator">
      <section aria-label="Product media" className="product-gallery">
        <div className="product-gallery__main">
          {image ? (
            <button
              aria-haspopup="dialog"
              aria-label={`Enlarge ${image.altText || product.title}`}
              className="product-gallery__zoom-trigger"
              onClick={() => zoomDialogRef.current?.showModal()}
              type="button"
            >
              <Image
                alt={image.altText || product.title}
                fill
                priority
                sizes="(min-width: 1000px) 55vw, 100vw"
                src={image.url}
              />
            </button>
          ) : <span>Image unavailable</span>}
          {media.length > 1 ? (
            <div className="product-gallery__arrows">
              <button aria-label="Previous image" onClick={() => showMedia(shownIndex - 1)} type="button"><ChevronLeftIcon /></button>
              <button aria-label="Next image" onClick={() => showMedia(shownIndex + 1)} type="button"><ChevronRightIcon /></button>
            </div>
          ) : null}
          {media.length ? <span aria-live="polite" className="product-gallery__status">{shownIndex + 1} / {media.length}</span> : null}
        </div>
        {media.length > 1 ? (
          <div className="product-gallery__thumb-rail">
            <button aria-label="Previous thumbnail" className="product-gallery__thumb-nav" onClick={() => showMedia(shownIndex - 1)} type="button"><ChevronLeftIcon /></button>
            <div aria-label="Choose product image" className="product-gallery__thumbs" ref={thumbnailRailRef}>
              {media.map((item, index) => (
                <MediaButton active={index === shownIndex} image={item} index={index} key={item.id} onSelect={showMedia} productTitle={product.title} />
              ))}
            </div>
            <button aria-label="Next thumbnail" className="product-gallery__thumb-nav" onClick={() => showMedia(shownIndex + 1)} type="button"><ChevronRightIcon /></button>
          </div>
        ) : null}
        <dialog aria-label={`${product.title} image viewer`} className="product-gallery__zoom-dialog" ref={zoomDialogRef}>
          <button aria-label="Close image viewer" className="product-gallery__zoom-close" onClick={() => zoomDialogRef.current?.close()} type="button">Close</button>
          <div className="product-gallery__zoom-canvas">
            {image ? <Image alt={image.altText || product.title} fill sizes="95vw" src={image.url} /> : null}
          </div>
        </dialog>
      </section>

      <section className="product-summary">
        {brandLine ? <p className="product-summary__brand-line">{brandLine}</p> : null}
        {campaignLabel ? <p className="product-summary__campaign-label">{campaignLabel}</p> : null}
        <h1>{product.title}</h1>
        <div className="product-summary__price" aria-live="polite">
          <span className={onSale ? "price--sale" : ""}>{formatMoney(price)}</span>
          {onSale && compareAt ? <s>{formatMoney(compareAt)}</s> : null}
        </div>
        {campaignLabel && product.description ? (
          <p className="product-summary__description">
            {product.description.split(/(?<=[.!?])\s+/)[0]}
          </p>
        ) : null}
        <div className="variant-selector">
          {product.options.filter((option) => option.name !== "Title").map((option, optionIndex, visibleOptions) => (
            <fieldset key={option.id}>
              <legend>{option.name}: <span>{selected[option.name]}</span></legend>
              <div className={`variant-selector__values${option.name.toLowerCase().includes("color") ? " variant-selector__values--swatches" : ""}`}>
                {option.values.map((value) => {
                  const previousOptions = visibleOptions.slice(0, optionIndex);
                  const matchesChoice = (candidate: ProductVariant) =>
                    candidate.selectedOptions.some((item) => item.name === option.name && item.value === value) &&
                    previousOptions.every((previous) =>
                      candidate.selectedOptions.some((item) => item.name === previous.name && item.value === selected[previous.name]),
                    );
                  const valueExists = product.variants.some(matchesChoice);
                  const valueAvailable = product.variants.some((candidate) => candidate.availableForSale && matchesChoice(candidate));
                  const isSwatch = option.name.toLowerCase().includes("color");
                  return (
                    <button
                      aria-pressed={selected[option.name] === value}
                      className={`${selected[option.name] === value ? "is-selected" : ""}${valueAvailable ? "" : " is-sold-out"}`}
                      disabled={!valueExists}
                      key={value}
                      onClick={() => chooseOption(option.name, value)}
                      title={isSwatch ? value : undefined}
                      type="button"
                    >
                      {isSwatch ? <><span aria-hidden="true" className="color-swatch" style={{ backgroundColor: swatchColors[value] || "#ffffff" }} /><span className="sr-only">{value}</span></> : value}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>

        <div className="purchase-row">
          <div aria-label="Quantity" className="quantity-selector">
            <button aria-label="Decrease quantity" disabled={quantity === 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))} type="button">−</button>
            <output aria-live="polite">{quantity}</output>
            <button aria-label="Increase quantity" onClick={() => setQuantity((value) => value + 1)} type="button">+</button>
          </div>
          <button
            aria-describedby="commerce-boundary-note"
            className="button button--primary purchase-button"
            data-commerce-state={cartEnabled ? "retail" : "setup-pending"}
            disabled={!cartEnabled || !variant?.availableForSale || isAdding}
            onClick={addToCart}
            type="button"
          >
            {isAdding ? "Adding…" : !variant?.availableForSale ? "Sold out" : "Add to cart"}
          </button>
        </div>
        <p className="commerce-boundary-note" id="commerce-boundary-note">
          {cartEnabled
            ? "Retail pricing and availability are confirmed by Shopify. Final totals are calculated in Shopify checkout."
            : "Retail cart is fully scaffolded but remains disconnected until Shopify cart access and the commerce gate are approved."}
        </p>
        {cartMessage ? <p aria-live="polite" className={cartMessageType === "success" ? "cart-success" : "cart-error"}>{cartMessage}</p> : null}
      </section>
    </div>
  );
}

function MediaButton({ active, image, index, onSelect, productTitle }: { active: boolean; image: ShopifyImage; index: number; onSelect: (index: number) => void; productTitle: string }) {
  return (
    <button aria-label={`Show image ${index + 1}`} className={active ? "is-active" : ""} onClick={() => onSelect(index)} type="button">
      <Image alt={image.altText || productTitle} fill sizes="90px" src={image.url} />
    </button>
  );
}
