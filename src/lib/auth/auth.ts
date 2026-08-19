import {
  randomBytes,
  scrypt as nodeScrypt,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
import { SignJWT, jwtVerify } from "jose";
import { db } from "@/lib/db";

const scrypt = promisify(nodeScrypt);

const SESSION_COOKIE = "dms_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret || secret === "replace-with-a-generated-random-secret") {
    throw new Error("AUTH_SECRET is not configured securely.");
  }

  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16);

  const derivedKey = (await scrypt(
    password,
    salt,
    64,
  )) as Buffer;

  return [
    "scrypt",
    salt.toString("base64url"),
    derivedKey.toString("base64url"),
  ].join("$");
}

export async function verifyPassword(
  password: string,
  storedHash: string,
) {
  const parts = storedHash.split("$");

  if (parts.length !== 3 || parts[0] !== "scrypt") {
    return false;
  }

  const saltEncoded = parts[1];
  const hashEncoded = parts[2];

  if (!saltEncoded || !hashEncoded) {
    return false;
  }

  const salt = Buffer.from(saltEncoded, "base64url");
  const expectedHash = Buffer.from(hashEncoded, "base64url");

  const derivedKey = (await scrypt(
    password,
    salt,
    expectedHash.length,
  )) as Buffer;

  return (
    derivedKey.length === expectedHash.length &&
    timingSafeEqual(derivedKey, expectedHash)
  );
}

export async function createSession(userId: string) {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getAuthSecret());
}

export async function verifySession(token: string) {
  try {
    const { payload } = await jwtVerify(token, getAuthSecret(), {
      algorithms: ["HS256"],
    });

    if (!payload.sub) {
      return null;
    }

    return {
      userId: payload.sub,
    };
  } catch {
    return null;
  }
}

export async function authenticateUser(
  email: string,
  password: string,
) {
  const user = await db.user.findUnique({
    where: {
      email: email.trim().toLowerCase(),
    },
  });

  if (!user || !user.isActive || !user.passwordHash) {
    return null;
  }

  const validPassword = await verifyPassword(
    password,
    user.passwordHash,
  );

  if (!validPassword) {
    return null;
  }

  return user;
}

export function getSessionCookieName() {
  return SESSION_COOKIE;
}

export function getSessionDurationSeconds() {
  return SESSION_DURATION_SECONDS;
}
