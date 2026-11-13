"use client";

import { useEffect, useState } from "react";

/**
 * Fallback used until RESEND_API_KEY is set: a plain HTML form posted to Shopify's
 * storefront `/contact` endpoint (like the theme's `{% form 'contact' %}`), which
 * emails the store's contact address. It posts to Shopify's primary domain directly:
 * the myshopify.com address 301s there, and that redirect was blocked by the CSP
 * `form-action` rule. Shopify sends the visitor back to /pages/contact on its domain,
 * and the theme forwards to www with `?contact_posted=true` intact.
 */
const SHOPIFY_CONTACT_ACTION = "https://checkout.northwestern.golf/contact#contact_form";

export function ShopifyContactForm() {
  const [posted, setPosted] = useState(false);
  useEffect(() => {
    // Read after mount so the page can stay statically rendered.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPosted(new URLSearchParams(window.location.search).get("contact_posted") === "true");
  }, []);

  return (
    <form acceptCharset="UTF-8" action={SHOPIFY_CONTACT_ACTION} id="contact_form" method="post">
      <input name="form_type" type="hidden" value="contact" />
      <input name="utf8" type="hidden" value="✓" />
      <input name="return_to" type="hidden" value="/pages/contact?contact_posted=true#contact_form" />
      <h3 className="nwg-page-contact__form-title">Send us a message</h3>
      <p className="nwg-page-contact__form-note">Questions, feedback or partnerships: we’ll get back to you as soon as we can.</p>
      {posted ? (
        <p className="nwg-page-contact__success" role="status">Thanks for getting in touch. We’ll get back to you as soon as possible.</p>
      ) : null}
      <div className="nwg-page-contact__fields">
        <div className="nwg-page-contact__field">
          <label htmlFor="contact-name">Name</label>
          <input autoComplete="name" id="contact-name" name="contact[name]" required type="text" />
        </div>
        <div className="nwg-page-contact__field">
          <label htmlFor="contact-email">Email</label>
          <input autoComplete="email" id="contact-email" name="contact[email]" required type="email" />
        </div>
        <div className="nwg-page-contact__field nwg-page-contact__field--full">
          <label htmlFor="contact-phone">Phone <span>(optional)</span></label>
          <input autoComplete="tel" id="contact-phone" name="contact[phone]" type="tel" />
        </div>
        <div className="nwg-page-contact__field nwg-page-contact__field--full">
          <label htmlFor="contact-body">Message</label>
          <textarea id="contact-body" name="contact[body]" required rows={6} />
        </div>
        <button className="nwg-page-contact__submit" type="submit">Send message</button>
      </div>
    </form>
  );
}
