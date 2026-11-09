"use client";

import { useEffect, useMemo, useState, useTransition, type CSSProperties } from "react";
import { addCartLineAction } from "@/app/cart/actions";
import { publishCartUpdate } from "@/components/cart/cart-events";
import { formatMoney } from "@/components/commerce/Money";
import type { ProductInfoContent } from "@/lib/product-content";
import type { Money, Product, ProductVariant } from "@/lib/shopify";
import { ChevronSmallIcon, InfoCircleIcon, OfferIcon, ShopPayLogo } from "./icons";
import { ProductGallery } from "./ProductGallery";

const GOVX_ICON = "https://cdn.shopify.com/extensions/01a13144-9e58-72de-8899-4066b420ebeb/0.0.18/assets/govx-id.svg";

function optionMap(variant: ProductVariant) {
  return Object.fromEntries(variant.selectedOptions.map((option) => [option.name, option.value]));
}

type PickerOption = { id: string; name: string; swatches: Record<string, string>; values: string[] };

/**
 * Option values in the order Liquid renders them on live (first appearance
 * across variants), with any Shopify colour-swatch metadata.
 */
function orderedOptions(product: Product): PickerOption[] {
  return product.options
    .filter((option) => !(option.name === "Title" && option.values.length === 1 && option.values[0] === "Default Title"))
    .map((option) => {
      const values: string[] = [];
      for (const variant of product.variants) {
        const value = variant.selectedOptions.find((item) => item.name === option.name)?.value;
        if (value && !values.includes(value)) values.push(value);
      }
      for (const value of option.values) if (!values.includes(value)) values.push(value);
      const swatches: Record<string, string> = {};
      for (const value of option.optionValues ?? []) if (value.swatch?.color) swatches[value.name] = value.swatch.color;
      return { id: option.id, name: option.name, swatches, values };
    });
}

function numericVariantId(id: string) {
  return id.replace("gid://shopify/ProductVariant/", "");
}

/**
 * Shop Pay Installments copy as rendered by Shopify's payment-terms widget:
 * 0% split pay for $35–$999.99 and 15% APR monthly plans from $50.
 */
function installments(price: Money) {
  const amount = Number(price.amount);
  const money = (value: number) => formatMoney({ amount: value.toFixed(2), currencyCode: price.currencyCode });
  const rate = 0.15 / 12;
  const monthly = (amount * rate) / (1 - (1 + rate) ** -12);
  if (amount >= 1000 && amount <= 30000) return { lead: "From ", monthly: money(monthly), perPayment: false };
  if (amount >= 50) return { lead: "4 interest-free installments, or from ", monthly: money(monthly), perPayment: false };
  if (amount >= 35) return { lead: "2 interest-free installments of ", monthly: money(amount / 2), perPayment: true };
  return null;
}

export function ProductMain({
  cartEnabled,
  info,
  initialVariantId,
  product,
}: {
  cartEnabled: boolean;
  info: ProductInfoContent;
  initialVariantId?: string;
  product: Product;
}) {
  const requestedVariant = product.variants.find((variant) => numericVariantId(variant.id) === initialVariantId);
  const initialVariant =
    requestedVariant ?? product.variants.find((variant) => variant.availableForSale) ?? product.variants[0];
  const [selected, setSelected] = useState<Record<string, string>>(initialVariant ? optionMap(initialVariant) : {});
  const [hasSelectedVariant, setHasSelectedVariant] = useState(false);
  const media = product.images;
  // Like Liquid's `selected_variant`, only an explicit ?variant= jumps to its media.
  const initialMediaIndex = Math.max(0, media.findIndex((image) => image.id === requestedVariant?.image?.id));
  const [activeMediaIndex, setActiveMediaIndex] = useState(initialMediaIndex);
  const [cartMessage, setCartMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [isAdding, startAdding] = useTransition();

  const variant =
    product.variants.find((candidate) => candidate.selectedOptions.every((option) => selected[option.name] === option.value)) ??
    initialVariant;
  const price = variant?.price ?? product.priceRange.minVariantPrice;
  const compareAt = variant?.compareAtPrice;
  const onSale = Boolean(compareAt && Number(compareAt.amount) > Number(price.amount));
  const available = Boolean(variant?.availableForSale);
  const terms = installments(price);
  const visibleOptions = useMemo(() => orderedOptions(product), [product]);

  useEffect(() => {
    if (!hasSelectedVariant || !variant) return;
    const url = new URL(window.location.href);
    url.searchParams.set("variant", numericVariantId(variant.id));
    window.history.replaceState(window.history.state, "", url);
  }, [hasSelectedVariant, variant]);

  function chooseOption(name: string, value: string) {
    setHasSelectedVariant(true);
    setCartMessage(null);
    const next = { ...selected, [name]: value };
    const exact = product.variants.find((candidate) => candidate.selectedOptions.every((option) => next[option.name] === option.value));
    const fallback = product.variants.find((candidate) => candidate.selectedOptions.some((option) => option.name === name && option.value === value));
    const resolved = exact ?? fallback;
    setSelected(resolved ? optionMap(resolved) : next);
    const imageId = resolved?.image?.id;
    if (imageId) {
      const index = media.findIndex((image) => image.id === imageId);
      if (index >= 0) setActiveMediaIndex(index);
    }
  }

  function addToCart() {
    if (!variant || !cartEnabled || !available) return;
    setCartMessage(null);
    startAdding(async () => {
      const result = await addCartLineAction(variant.id, 1);
      setCartMessage({ ok: result.ok, text: result.message });
      if (result.ok && result.cart) publishCartUpdate(result.cart, true, result.message);
    });
  }

  return (
    <section className="nwg-pdp-main">
      <div className="nwg-pdp-main__grid">
        <ProductGallery
          activeIndex={activeMediaIndex}
          media={media}
          onActiveIndexChange={setActiveMediaIndex}
          productTitle={product.title}
        />

        <div className="nwg-pdp-info">
          <h1 className="nwg-pdp-info__title">{product.title}</h1>

          {info.introHtml ? (
            <div className="nwg-pdp-info__block nwg-pdp-info__intro nwg-pdp-prose" dangerouslySetInnerHTML={{ __html: info.introHtml }} />
          ) : null}

          <div aria-live="polite" className="nwg-pdp-info__block nwg-pdp-info__price">
            <span className="nwg-pdp-price">
              <span className="sr-only">Sale price</span>
              {formatMoney(price)}
            </span>
            {onSale && compareAt ? (
              <s className="nwg-pdp-price nwg-pdp-price--compare">
                <span className="sr-only">Regular price</span>
                {formatMoney(compareAt)}
              </s>
            ) : null}
            {!available ? (
              <span className="nwg-pdp-badge">Sold out</span>
            ) : onSale && compareAt ? (
              <span className="nwg-pdp-badge nwg-pdp-badge--sale">
                Save {formatMoney({ amount: (Number(compareAt.amount) - Number(price.amount)).toFixed(2), currencyCode: price.currencyCode })}
              </span>
            ) : null}
            {info.rating ? (
              <a className="nwg-pdp-rating" href="#nwg-pdp-reviews" title={`${info.rating.count} review${info.rating.count === 1 ? "" : "s"}`}>
                <span>{info.rating.value.toFixed(1)}</span>
                <svg aria-label={`${info.rating.value.toFixed(1)} out of 5.0 stars`} height="12" role="img" viewBox="0 0 15 15" width="12">
                  <path d="M7.5 0L9.58587 5.2731L15 5.72949L10.875 9.44483L12.1353 15L7.5 12.0231L2.86475 15L4.125 9.44483L0 5.72949L5.41414 5.2731L7.5 0Z" fill="currentColor" />
                </svg>
              </a>
            ) : null}
          </div>

          {terms ? (
            <p className="nwg-pdp-info__block nwg-pdp-info__installments">
              {terms.lead}<strong>{terms.monthly}</strong>{terms.perPayment ? "" : "/mo"} with{" "}
              <span className="nwg-pdp-info__shop-logo"><ShopPayLogo height={14} width={34} /></span>
              <InfoCircleIcon className="nwg-pdp-info__installments-icon" height={20} width={20} />
            </p>
          ) : null}

          <hr className="nwg-pdp-info__block nwg-pdp-info__separator" />

          {visibleOptions.length ? (
            <div className="nwg-pdp-info__block nwg-pdp-variants">
              {visibleOptions.map((option, optionIndex) => (
                <fieldset className="nwg-pdp-variants__option" key={option.id}>
                  <div className="nwg-pdp-variants__label">
                    <legend>{option.name}:</legend>
                    <span>{selected[option.name]}</span>
                  </div>
                  <div className={`nwg-pdp-variants__values${Object.keys(option.swatches).length ? " has-swatches" : ""}`}>
                    {option.values.map((value) => {
                      const previous = visibleOptions.slice(0, optionIndex);
                      const matches = (candidate: ProductVariant) =>
                        candidate.selectedOptions.some((item) => item.name === option.name && item.value === value) &&
                        previous.every((prev) => candidate.selectedOptions.some((item) => item.name === prev.name && item.value === selected[prev.name]));
                      const valueAvailable = product.variants.some((candidate) => candidate.availableForSale && matches(candidate));
                      const isSelected = selected[option.name] === value;
                      const color = option.swatches[value];
                      if (color) {
                        return (
                          <button
                            aria-label={`${value}${valueAvailable ? "" : " (sold out)"}`}
                            aria-pressed={isSelected}
                            className={`nwg-pdp-color-swatch${isSelected ? " is-selected" : ""}${valueAvailable ? "" : " is-disabled"}`}
                            key={value}
                            onClick={() => chooseOption(option.name, value)}
                            style={{ "--swatch-color": color } as CSSProperties}
                            title={value}
                            type="button"
                          />
                        );
                      }
                      return (
                        <button
                          aria-pressed={isSelected}
                          className={`nwg-pdp-swatch${isSelected ? " is-selected" : ""}${valueAvailable ? "" : " is-disabled"}`}
                          key={value}
                          onClick={() => chooseOption(option.name, value)}
                          type="button"
                        >
                          <span>{value}</span>
                          {valueAvailable ? null : <span className="sr-only"> (sold out)</span>}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
            </div>
          ) : null}

          <div className="nwg-pdp-info__block nwg-pdp-info__buy">
            <button
              className={`nwg-pdp-buy${available && cartEnabled ? "" : " is-subdued"}`}
              data-commerce-state={cartEnabled ? "retail" : "setup-pending"}
              disabled={!cartEnabled || !available || isAdding}
              onClick={addToCart}
              type="button"
            >
              {isAdding ? "Adding…" : available ? "Add to cart" : "Sold out"}
            </button>
            {cartMessage ? (
              <p aria-live="polite" className={`nwg-pdp-info__cart-message${cartMessage.ok ? "" : " is-error"}`}>{cartMessage.text}</p>
            ) : null}
          </div>

          {info.offers.length ? (
            <div className="nwg-pdp-info__block nwg-pdp-offers">
              {info.offers.map((offer) => (
                <div className="nwg-pdp-offer" key={offer.text}>
                  <OfferIcon icon={offer.icon} />
                  <span>{offer.text}</span>
                </div>
              ))}
            </div>
          ) : null}

          {info.govx ? (
            // GOVX verification is a deferred commerce integration (see
            // COMMERCE_GATE.govx); the bar mirrors live but stays informational.
            <div className="nwg-pdp-info__block nwg-pdp-govx">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" height={24} loading="lazy" src={GOVX_ICON} width={24} />
              <p>Military, First Responder, Government Employee and Teacher discount available</p>
            </div>
          ) : null}

          {info.accordions.length ? (
            <div className="nwg-pdp-info__block nwg-pdp-accordions">
              {info.accordions.map((item) => (
                <details className="nwg-pdp-accordion" key={item.title}>
                  <summary>
                    <span>{item.title}</span>
                    <span aria-hidden="true" className="nwg-pdp-accordion__chevron"><ChevronSmallIcon /></span>
                  </summary>
                  <div className="nwg-pdp-accordion__content nwg-pdp-prose" dangerouslySetInnerHTML={{ __html: item.html }} />
                </details>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
