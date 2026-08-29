import "server-only";

import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";
import { cookies } from "next/headers";

const CART_COOKIE = "nwg_cart";
const COOKIE_VERSION = "v1";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function cookieKey() {
  const secret = process.env.SHOPIFY_CART_COOKIE_SECRET?.trim();

  if (!secret || secret.length < 32) {
    throw new Error(
      "SHOPIFY_CART_COOKIE_SECRET must contain at least 32 characters when retail cart is enabled.",
    );
  }

  return createHash("sha256").update(secret).digest();
}

function encrypt(value: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", cookieKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [
    COOKIE_VERSION,
    iv.toString("base64url"),
    tag.toString("base64url"),
    encrypted.toString("base64url"),
  ].join(".");
}

function decrypt(value: string) {
  try {
    const [version, ivValue, tagValue, encryptedValue] = value.split(".");
    if (version !== COOKIE_VERSION || !ivValue || !tagValue || !encryptedValue) {
      return null;
    }

    const decipher = createDecipheriv(
      "aes-256-gcm",
      cookieKey(),
      Buffer.from(ivValue, "base64url"),
    );
    decipher.setAuthTag(Buffer.from(tagValue, "base64url"));
    return Buffer.concat([
      decipher.update(Buffer.from(encryptedValue, "base64url")),
      decipher.final(),
    ]).toString("utf8");
  } catch {
    return null;
  }
}

export async function readCartId() {
  const value = (await cookies()).get(CART_COOKIE)?.value;
  return value ? decrypt(value) : null;
}

export async function writeCartId(cartId: string) {
  (await cookies()).set(CART_COOKIE, encrypt(cartId), {
    httpOnly: true,
    maxAge: COOKIE_MAX_AGE_SECONDS,
    path: "/",
    priority: "high",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearCartId() {
  (await cookies()).delete(CART_COOKIE);
}
