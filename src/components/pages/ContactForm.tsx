"use client";

import { useActionState, useEffect, useRef } from "react";
import { sendContactMessage, type ContactState } from "@/lib/contact/actions";

const initialState: ContactState = { message: "", status: "idle" };

/** Contact form posting to a server action that emails the message through Resend. */
export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContactMessage, initialState);
  const startedAt = useRef<HTMLInputElement>(null);
  const values = state.status === "error" ? state.values : undefined;

  // Timestamp for the "filled in too fast" bot check; set after mount.
  useEffect(() => {
    if (startedAt.current) startedAt.current.value = String(Date.now());
  }, [state]);

  return (
    <form action={formAction} id="contact_form">
      <h3 className="nwg-page-contact__form-title">Send us a message</h3>
      <p className="nwg-page-contact__form-note">Questions, feedback or partnerships: we’ll get back to you as soon as we can.</p>
      {state.message ? (
        <p
          aria-live="polite"
          className={state.status === "sent" ? "nwg-page-contact__success" : "nwg-page-contact__error"}
          role={state.status === "sent" ? "status" : "alert"}
        >
          {state.message}
        </p>
      ) : null}
      {/* Remount the fields after each submit so an error restores what was typed. */}
      <div className="nwg-page-contact__fields" key={JSON.stringify(values ?? state.status)}>
        <div className="nwg-page-contact__field">
          <label htmlFor="contact-name">Name</label>
          <input autoComplete="name" defaultValue={values?.name} id="contact-name" maxLength={100} name="name" required type="text" />
        </div>
        <div className="nwg-page-contact__field">
          <label htmlFor="contact-email">Email</label>
          <input autoComplete="email" defaultValue={values?.email} id="contact-email" maxLength={200} name="email" required type="email" />
        </div>
        <div className="nwg-page-contact__field nwg-page-contact__field--full">
          <label htmlFor="contact-phone">Phone <span>(optional)</span></label>
          <input autoComplete="tel" defaultValue={values?.phone} id="contact-phone" maxLength={40} name="phone" type="tel" />
        </div>
        <div className="nwg-page-contact__field nwg-page-contact__field--full">
          <label htmlFor="contact-body">Message</label>
          <textarea defaultValue={values?.body} id="contact-body" maxLength={5000} name="body" required rows={6} />
        </div>
        {/* Honeypot: hidden from people, often filled by bots. */}
        <div aria-hidden="true" className="nwg-page-contact__trap">
          <label htmlFor="contact-company">Company</label>
          <input autoComplete="off" id="contact-company" name="company" tabIndex={-1} type="text" />
        </div>
        <input name="started_at" ref={startedAt} type="hidden" />
        <button className="nwg-page-contact__submit" disabled={pending} type="submit">
          {pending ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
