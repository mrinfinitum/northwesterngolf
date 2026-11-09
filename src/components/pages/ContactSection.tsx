import Image from "next/image";
import Link from "next/link";
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

const ICONS = {
  email: <path d="M3 6h18v12H3zM3 7l9 6 9-6" />,
  hours: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  pin: <><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z" />,
};

function Icon({ name }: { name: keyof typeof ICONS }) {
  return (
    <span aria-hidden="true" className="nwg-page-contact__icon">
      <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" viewBox="0 0 24 24">{ICONS[name]}</svg>
    </span>
  );
}

const HELP = [
  { href: "/policies/refund-policy", text: "How returns and exchanges work.", title: "Returns" },
  { href: "/collections/all", text: "Men’s and Junior Signature Sets.", title: "Shop the sets" },
  { href: "/pages/john-daly", text: "The story behind the Signature Sets.", title: "Meet John Daly" },
];

export function ContactSection({ posted, section }: { posted: boolean; section: ContactConfig }) {
  const phoneHref = `tel:+1${section.phone.replace(/\D/g, "")}`;
  const details = [
    { icon: "phone" as const, label: "Call", value: <a href={phoneHref}>{section.phone}</a> },
    { icon: "email" as const, label: "Email", value: <a href={`mailto:${section.email}`}>{section.email}</a> },
    { icon: "hours" as const, label: "Hours", value: section.hours.replace(/\./g, ":").replace(" - ", "–") },
    {
      icon: "pin" as const,
      label: "Headquarters",
      value: <a href={section.addressHref} rel="noreferrer" target="_blank">{section.address.replace(", USA", "")}</a>,
    },
  ];

  return (
    <section className="nwg-page-contact">
      <div className="nwg-page-contact__card">
        <div className="nwg-page-contact__info">
          <div className="nwg-page-contact__photo">
            <Image alt="John Daly checking his Northwestern Signature driver" fill sizes="(min-width: 1000px) 520px, 100vw" src="/images/daly/jd-inspect.jpg" />
          </div>
          <div className="nwg-page-contact__info-body">
            <p className="nwg-page-contact__eyebrow">{section.smallTitle}</p>
            <h2 className="nwg-page-contact__heading">{section.heading}</h2>
            <p className="nwg-page-contact__description">{section.description}</p>
            <ul className="nwg-page-contact__details">
              {details.map((detail) => (
                <li className="nwg-page-contact__detail" key={detail.label}>
                  <Icon name={detail.icon} />
                  <span className="nwg-page-contact__detail-text">
                    <span className="nwg-page-contact__detail-label">{detail.label}</span>
                    <span className="nwg-page-contact__detail-value">{detail.value}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
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

      <ul className="nwg-page-contact__help">
        {HELP.map((item) => (
          <li key={item.href}>
            <Link className="nwg-page-contact__help-link" href={item.href}>
              <span className="nwg-page-contact__help-title">{item.title}</span>
              <span className="nwg-page-contact__help-text">{item.text}</span>
              <span aria-hidden="true" className="nwg-page-contact__help-arrow">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
