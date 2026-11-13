/**
 * Shipping facts, mirrored from Shopify Admin → Settings → Shipping and delivery
 * (General profile, one zone: United States). Update here if the rates change:
 * the shipping policy page, the product-page "Shipping & Returns" panel and the
 * product structured data all read from this file.
 */
export const SHIPPING = {
  country: "US",
  shipsFrom: "Fortville, Indiana",
  standardDays: { max: 4, min: 3 },
  standardPrice: "20.00",
} as const;

const standard = `$${Number(SHIPPING.standardPrice)}`;
const days = `${SHIPPING.standardDays.min}–${SHIPPING.standardDays.max}`;

/** Product page "Shipping & Returns" accordion body. */
export const SHIPPING_RETURNS_HTML =
  `<p><strong>Shipping:</strong> ${standard} flat-rate standard shipping to U.S. addresses (${days} business days once it ships). ` +
  `Faster FedEx options are priced at checkout. Pre-order sets ship by the date shown on this page.</p>` +
  `<p><strong>Returns:</strong> Easy 30-day returns and a 1-year warranty, so you can play, test and get comfortable with your clubs. ` +
  `If the set isn’t right for you, we’ll help you make it right.</p>` +
  `<p><a href="/policies/shipping-policy">Shipping policy</a> · <a href="/policies/refund-policy">Return policy</a></p>`;

/** Shopify has no shipping policy, so /policies/shipping-policy uses this one. */
export const SHIPPING_POLICY = {
  handle: "shipping-policy",
  title: "Shipping Policy",
  body: `
<div class="tab-section"><a href="/policies/privacy-policy">Privacy Policy</a> <a style="margin: 0 20px;" href="/policies/terms-of-service">Terms &amp; Conditions</a> <a href="/policies/refund-policy">Return Policy</a> <a style="margin-left: 20px;" href="/policies/shipping-policy">Shipping Policy</a></div>
<h1>Shipping Policy</h1>
<h3>Where we ship</h3>
<p>We currently ship to addresses in the United States. Orders ship from ${SHIPPING.shipsFrom}.</p>
<h3>Rates and delivery times</h3>
<ul>
<li><strong>Standard shipping: ${standard} per order.</strong> Arrives in ${days} business days once your order ships.</li>
<li><strong>FedEx Ground, FedEx Home Delivery and FedEx Express Saver:</strong> priced for your address at checkout, with the estimated delivery time shown for each.</li>
</ul>
<p>Sales tax, where it applies, is calculated at checkout.</p>
<h3>Pre-orders</h3>
<p>Sets marked “Pre-order” ship by the date shown on the product page.</p>
<h3>Tracking</h3>
<p>When your order ships you’ll get an email with a tracking number. You can also check your order status by signing in to your account.</p>
<h3>Damaged, lost or wrong items</h3>
<p>If your set arrives damaged or isn’t what you ordered, email <a href="mailto:info@northwestern.golf">info@northwestern.golf</a> with your order number and we’ll make it right. If tracking shows your package as delivered but you can’t find it, contact us and we’ll help.</p>
<h3>Returns</h3>
<p>You can return a set within 30 days of purchase. Return shipping is paid by the customer unless the item arrived damaged or was incorrect, and shipping charges aren’t refundable. See our <a href="/policies/refund-policy">Return Policy</a> for the full details.</p>
<h3>Questions</h3>
<p>Email <a href="mailto:info@northwestern.golf">info@northwestern.golf</a> or visit our <a href="/pages/contact">contact page</a>.</p>
`.trim(),
};
