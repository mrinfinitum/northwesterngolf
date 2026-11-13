"use server";

import { headers } from "next/headers";

/**
 * Contact form → Resend. Needs RESEND_API_KEY in Vercel, and the sending domain
 * (northwestern.golf) verified in Resend. Messages go to CONTACT_TO_EMAIL with
 * Reply-To set to the visitor, so replying from the inbox answers them directly.
 */
const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DEFAULT_TO = "info@northwestern.golf";
const DEFAULT_FROM = "Northwestern Golf Website <website@northwestern.golf>";
const FALLBACK_EMAIL = "info@northwestern.golf";

export type ContactValues = { body: string; email: string; name: string; phone: string };
export type ContactState = {
  message: string;
  status: "error" | "idle" | "sent";
  /** Echoed back on errors so the visitor doesn't lose what they typed. */
  values?: ContactValues;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MIN_FILL_MS = 2500;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
// Best-effort per-instance limit; serverless instances don't share it.
const recent = new Map<string, number[]>();

const field = (formData: FormData, name: string, max: number) => String(formData.get(name) ?? "").trim().slice(0, max);

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] ?? char);

function rateLimited(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > MAX_PER_WINDOW;
}

export async function sendContactMessage(_previous: ContactState, formData: FormData): Promise<ContactState> {
  const values: ContactValues = {
    body: field(formData, "body", 5000),
    email: field(formData, "email", 200),
    name: field(formData, "name", 100),
    phone: field(formData, "phone", 40),
  };

  // Bots: a filled hidden field, or a form sent faster than a person can type.
  const startedAt = Number(formData.get("started_at"));
  if (field(formData, "company", 200) || (startedAt && Date.now() - startedAt < MIN_FILL_MS)) {
    return { message: "Thanks for getting in touch. We’ll get back to you as soon as possible.", status: "sent" };
  }

  if (!values.name || !values.body) return { message: "Please add your name and a message.", status: "error", values };
  if (!EMAIL.test(values.email)) return { message: "Please enter a valid email address.", status: "error", values };

  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return { message: `Too many messages in a short time. Please try again later or email ${FALLBACK_EMAIL}.`, status: "error", values };
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.error("Contact form: RESEND_API_KEY is not set");
    return { message: `Sorry, the form isn’t working right now. Please email ${FALLBACK_EMAIL}.`, status: "error", values };
  }

  const lines = [
    ["Name", values.name],
    ["Email", values.email],
    ["Phone", values.phone || "—"],
  ];
  const html = `<table cellpadding="4">${lines
    .map(([label, value]) => `<tr><td><strong>${label}</strong></td><td>${escapeHtml(value)}</td></tr>`)
    .join("")}</table><p style="white-space:pre-wrap">${escapeHtml(values.body)}</p>`;
  const text = `${lines.map(([label, value]) => `${label}: ${value}`).join("\n")}\n\n${values.body}`;

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL?.trim() || DEFAULT_FROM,
        html,
        reply_to: values.email,
        subject: `Website message from ${values.name}`,
        text,
        to: (process.env.CONTACT_TO_EMAIL?.trim() || DEFAULT_TO).split(",").map((address) => address.trim()),
      }),
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      method: "POST",
    });
    if (!response.ok) {
      console.error("Contact form: Resend error", response.status, await response.text());
      return { message: `Sorry, your message didn’t send. Please try again or email ${FALLBACK_EMAIL}.`, status: "error", values };
    }
  } catch (error) {
    console.error("Contact form: Resend request failed", error);
    return { message: `Sorry, your message didn’t send. Please try again or email ${FALLBACK_EMAIL}.`, status: "error", values };
  }

  return { message: "Thanks for getting in touch. We’ll get back to you as soon as possible.", status: "sent" };
}
