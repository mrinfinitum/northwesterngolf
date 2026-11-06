import type { PageSection } from "./page-sections";

/**
 * The contact form is a plain HTML form posted to Shopify's storefront
 * `/contact` endpoint (form_type=contact), exactly like the theme's
 * `{% form 'contact' %}`. There is no Storefront API mutation for contact
 * messages and Shopify's endpoint is protected by bot challenges, so the
 * browser submits it directly (no server proxy, no secrets). `return_to`
 * sends the shopper back to this page with `contact_posted=true`.
 */
const CONTACT_FORM_ACTION = `https://${process.env.SHOPIFY_STORE_DOMAIN?.trim() || "r1kikk-am.myshopify.com"}/contact#contact_form`;

type ContactConfig = Extract<PageSection, { type: "contact" }>;

export function ContactSection({ posted, section }: { posted: boolean; section: ContactConfig }) {
  const phoneHref = `tel:+1${section.phone.replace(/\D/g, "")}`;

  return (
    <section className="nwg-page-contact">
      <div className="nwg-page-contact__container">
        <div className="nwg-page-contact__info">
          <p className="nwg-page-contact__eyebrow">{section.smallTitle}</p>
          <h2 className="nwg-page-contact__heading">{section.heading}</h2>
          <p className="nwg-page-contact__description">{section.description}</p>
          <ul className="nwg-page-contact__details">
            <li className="nwg-page-contact__detail">
              <span className="nwg-page-contact__detail-label">Email</span>
              <span className="nwg-page-contact__detail-value"><a href={`mailto:${section.email}`}>{section.email}</a></span>
            </li>
            <li className="nwg-page-contact__detail">
              <span className="nwg-page-contact__detail-label">Phone</span>
              <span className="nwg-page-contact__detail-value"><a href={phoneHref}>{section.phone}</a></span>
            </li>
            <li className="nwg-page-contact__detail">
              <span className="nwg-page-contact__detail-label">Hours</span>
              <span className="nwg-page-contact__detail-value">{section.hours.replace(/\./g, ":").replace(" - ", "–")}</span>
            </li>
            <li className="nwg-page-contact__detail">
              <span className="nwg-page-contact__detail-label">Headquarters</span>
              <span className="nwg-page-contact__detail-value">
                <a href={section.addressHref} rel="noreferrer" target="_blank">{section.address.replace(", USA", "")}</a>
              </span>
            </li>
          </ul>
        </div>

        <div className="nwg-page-contact__form">
          <form acceptCharset="UTF-8" action={CONTACT_FORM_ACTION} id="contact_form" method="post">
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
        </div>
      </div>
    </section>
  );
}
