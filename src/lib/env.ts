import { z } from "zod";

/**
 * Centralized, type-safe environment variable validation.
 *
 * Importing this module anywhere will throw a clear, descriptive error
 * immediately if required environment variables are missing or malformed,
 * instead of failing later with a confusing runtime error deep in the app.
 *
 * FOUNDATION PHASE NOTE: AUTH_SECRET is validated here so the architecture
 * is ready for the future authentication task, but it is not yet used to
 * sign or verify anything.
 */
const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  NEXT_PUBLIC_APP_URL: z.string().url("NEXT_PUBLIC_APP_URL must be a valid URL"),
  AUTH_SECRET: z.string().min(1, "AUTH_SECRET is required"),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const parsed = envSchema.safeParse({
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
  });

  if (!parsed.success) {
    const formatted = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(
      `Invalid or missing environment variables.\n${formatted}\n\n` +
        `Copy ".env.example" to ".env" and fill in real values.`,
    );
  }

  return parsed.data;
}

export const env = loadEnv();
