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

function PinIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 640 640">
      <path d="M128 252.6C128 148.4 214 64 320 64C426 64 512 148.4 512 252.6C512 371.9 391.8 514.9 341.6 569.4C329.8 582.2 310.1 582.2 298.3 569.4C248.1 514.9 127.9 371.9 127.9 252.6zM320 320C355.3 320 384 291.3 384 256C384 220.7 355.3 192 320 192C284.7 192 256 220.7 256 256C256 291.3 284.7 320 320 320z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 640 640">
      <path d="M112 128C85.5 128 64 149.5 64 176C64 191.1 71.1 205.3 83.2 214.4L291.2 370.4C308.3 383.2 331.7 383.2 348.8 370.4L556.8 214.4C568.9 205.3 576 191.1 576 176C576 149.5 554.5 128 528 128L112 128zM64 260L64 448C64 483.3 92.7 512 128 512L512 512C547.3 512 576 483.3 576 448L576 260L377.6 408.8C343.5 434.4 296.5 434.4 262.4 408.8L64 260z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 640 640">
      <path d="M528 320C528 434.9 434.9 528 320 528C205.1 528 112 434.9 112 320C112 205.1 205.1 112 320 112C434.9 112 528 205.1 528 320zM64 320C64 461.4 178.6 576 320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320zM296 184L296 320C296 328 300 335.5 306.7 340L402.7 404C413.7 411.4 428.6 408.4 436 397.3C443.4 386.2 440.4 371.4 429.3 364L344 307.2L344 184C344 170.7 333.3 160 320 160C306.7 160 296 170.7 296 184z" />
    </svg>
  );
}

export function ContactSection({ posted, section }: { posted: boolean; section: ContactConfig }) {
  return (
    <section className="nwg-page-contact">
      <div className="nwg-page-contact__container">
        <div className="nwg-page-contact__map">
          <iframe height="350" loading="lazy" src={section.mapEmbed} title={`Map: ${section.address}`} width="100%" />
        </div>
        <div className="nwg-page-contact__content">
          <div className="nwg-page-contact__info">
            <h4 className="nwg-page-contact__small-title">{section.smallTitle}</h4>
            <div className="nwg-page-contact__item">
              <p className="nwg-page-contact__label nwg-page-contact__label--address"><PinIcon />Address</p>
              <p className="nwg-page-contact__text">
                <a href={section.addressHref} rel="noreferrer" target="_blank">{section.address}</a>
              </p>
              <p className="nwg-page-contact__text">{section.phone}</p>
            </div>
            <h2 className="nwg-page-contact__heading">{section.heading}</h2>
            <div className="nwg-page-contact__divider" />
            <p className="nwg-page-contact__description">{section.description}</p>
            <div className="nwg-page-contact__item">
              <p className="nwg-page-contact__label"><MailIcon /><a href={`mailto:${section.email}`}>{section.email}</a></p>
            </div>
            <div className="nwg-page-contact__item">
              <p className="nwg-page-contact__label"><ClockIcon />{section.hours}</p>
            </div>
          </div>
          <div className="nwg-page-contact__form">
            <form acceptCharset="UTF-8" action={CONTACT_FORM_ACTION} id="contact_form" method="post">
              <input name="form_type" type="hidden" value="contact" />
              <input name="utf8" type="hidden" value="✓" />
              <input name="return_to" type="hidden" value="/pages/contact?contact_posted=true#contact_form" />
              {posted ? (
                <p className="nwg-page-contact__success" role="status">Thanks for contacting us. We’ll get back to you as soon as possible.</p>
              ) : null}
              <div className="nwg-page-contact__row">
                <input aria-label="Name" autoComplete="name" name="contact[name]" placeholder="Name" required type="text" />
              </div>
              <div className="nwg-page-contact__row">
                <input aria-label="Email" autoComplete="email" name="contact[email]" placeholder="Email" required type="email" />
              </div>
              <div className="nwg-page-contact__row">
                <input aria-label="Phone" autoComplete="tel" name="contact[phone]" placeholder="Phone" type="tel" />
              </div>
              <div className="nwg-page-contact__row">
                <textarea aria-label="Message" name="contact[body]" placeholder="Message" required rows={7} />
              </div>
              <button className="nwg-page-contact__submit" type="submit">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
