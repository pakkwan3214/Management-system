import { PrismaClient } from "@prisma/client";

/**
 * Database connection foundation.
 *
 * Next.js dev mode hot-reloads modules on every file change. Without this
 * singleton pattern, a new PrismaClient (and a new DB connection pool)
 * would be created on every reload, eventually exhausting the database's
 * connection limit. Storing the instance on `globalThis` in development
 * avoids that.
 */
declare global {
  var __prisma: PrismaClient | undefined;
}

export const db: PrismaClient = globalThis.__prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = db;
}
