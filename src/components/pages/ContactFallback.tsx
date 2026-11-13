/**
 * Shown in place of the contact form until RESEND_API_KEY is set. Shopify's storefront
 * `/contact` endpoint can't be used from this site: it requires an hCaptcha token that
 * only Shopify's own theme pages can produce ("Missing CAPTCHA token").
 */
export function ContactFallback({ email, phone }: { email: string; phone: string }) {
  const phoneHref = `tel:+1${phone.replace(/\D/g, "")}`;
  return (
    <div id="contact_form">
      <h3 className="nwg-page-contact__form-title">Send us a message</h3>
      <p className="nwg-page-contact__form-note">
        Questions, feedback or partnerships: email us and we’ll get back to you as soon as we can.
      </p>
      <div className="nwg-page-contact__fallback">
        <a className="nwg-page-contact__submit" href={`mailto:${email}?subject=${encodeURIComponent("Website enquiry")}`}>
          Email {email}
        </a>
        <p className="nwg-page-contact__form-note">
          Or call <a href={phoneHref}>{phone}</a>.
        </p>
      </div>
    </div>
  );
}
