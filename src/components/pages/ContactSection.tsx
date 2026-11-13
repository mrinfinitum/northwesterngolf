import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "./ContactForm";
import { ContactFallback } from "./ContactFallback";
import type { PageSection } from "./page-sections";

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

export function ContactSection({ section }: { section: ContactConfig }) {
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
            <Image alt="John Daly checking his Northwestern Signature driver" fill priority sizes="(min-width: 1000px) 520px, 100vw" src="/images/daly/jd-inspect.jpg" />
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
          {/* The form needs Resend; until its key is configured, offer email and phone. */}
          {process.env.RESEND_API_KEY ? <ContactForm /> : <ContactFallback email={section.email} phone={section.phone} />}
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
