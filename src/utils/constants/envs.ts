// envs.ts (zod v4.1.5)
import { z } from "zod";

/** Flags */
export const FLAGS = {
  IS_PROD: process.env.NODE_ENV === "production",
  IS_DEV: process.env.NODE_ENV === "development",
  IS_TEST: process.env.NODE_ENV === "test",
} as const;

/** Client-visible env */
const clientSchema = z.object({
  NEXT_PUBLIC_DEBUG: z.coerce.boolean().default(false),
});

/** Server-only env (intersect with client) */
const serverBaseSchema = z.object({
  DEBUG: z.coerce.boolean().default(false),

  BRAND_NAME: z.string(),
  BRAND_LOGO: z.union([z.url(), z.string().regex(/^\/(?!\/).+/)]),
  BRAND_EMAIL: z.email(),
  SUPPORT_EMAIL: z.email(),

  NEXT_PUBLIC_SITE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),

  SUPABASE_SERVICE_ROLE_KEY: z.string(),

  S3_STORAGE_ACCESS_KEY: z.string(),
  S3_STORAGE_ACCESS_SECRET: z.string(),

  POSTGRES_PASSWORD: z.string(),
  POSTGRES_URL: z.url(),

  RESEND_API_KEY: z.string(),

  TWILIO_ACCOUNT_SID: z.string(),
  TWILIO_AUTH_TOKEN: z.string(),
  TWILIO_API_SID: z.string(),
  TWILIO_API_SECRET: z.string(),
  TWILIO_MESSAGING_SERVICE_SID: z.string(),

  NEXT_PUBLIC_SENTRY_DSN: z.string(),
  SENTRY_AUTH_TOKEN: z.string(),

  DISCORD_WEBHOOK_CONTACT: z.url(),
  DISCORD_WEBHOOK_SUPPORT: z.url(),
});

const serverSchema = z.intersection(serverBaseSchema, clientSchema);

// type ServerEnvs = z.output<typeof serverSchema>;
// type PublicEnvs = z.output<typeof clientSchema>;

/** Build the inputs */
const baseEnv = {
  BRAND_NAME: process.env.BRAND_NAME,
  BRAND_LOGO: process.env.BRAND_LOGO,
  BRAND_EMAIL: process.env.BRAND_EMAIL,
  SUPPORT_EMAIL: process.env.SUPPORT_EMAIL,

  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,

  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,

  S3_STORAGE_ACCESS_KEY: process.env.S3_STORAGE_ACCESS_KEY,
  S3_STORAGE_ACCESS_SECRET: process.env.S3_STORAGE_ACCESS_SECRET,

  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_URL: process.env.POSTGRES_URL,

  RESEND_API_KEY: process.env.RESEND_API_KEY,

  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_API_SID: process.env.TWILIO_API_SID,
  TWILIO_API_SECRET: process.env.TWILIO_API_SECRET,
  TWILIO_MESSAGING_SERVICE_SID: process.env.TWILIO_MESSAGING_SERVICE_SID,

  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,

  DEBUG: process.env.DEBUG,
  NEXT_PUBLIC_DEBUG: process.env.NEXT_PUBLIC_DEBUG,

  DISCORD_WEBHOOK_CONTACT: process.env.DISCORD_WEBHOOK_CONTACT,
  DISCORD_WEBHOOK_SUPPORT: process.env.DISCORD_WEBHOOK_SUPPORT,
} as const;

/** Server: full validated shape + flags */
function createServerEnvs() {
  const parsed = serverSchema.safeParse(baseEnv);
  if (!parsed.success) {
    console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
  }

  const { DEBUG, NEXT_PUBLIC_DEBUG, ...rest } = parsed.data;

  const result = {
    ...rest,
    ...FLAGS,
    DEBUG,
    NEXT_PUBLIC_DEBUG,
  };

  return new Proxy(result, {
    get(target, prop) {
      if (typeof prop !== "string") return Reflect.get(target, prop);
      // flags and any server var are fine on server
      return Reflect.get(target, prop);
    },
  }) as typeof result;
}

/** Client: only public vars + flags */
function createPublicEnvs() {
  const parsed = clientSchema.safeParse(baseEnv);
  if (!parsed.success) {
    console.error("Invalid public environment variables:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
  }

  const { NEXT_PUBLIC_DEBUG } = parsed.data;

  const result = {
    ...FLAGS,
    NEXT_PUBLIC_DEBUG,
    DEBUG: NEXT_PUBLIC_DEBUG, // mirror for client
  };

  return new Proxy(result, {
    get(target, prop) {
      if (typeof prop !== "string") return Reflect.get(target, prop);
      if (!(prop in target)) {
        const msg =
          "Not allowed to access server-side environment variables outside server";
        throw new Error(process.env.NODE_ENV === "production" ? msg : `${msg}: ${prop}`);
      }
      return Reflect.get(target, prop);
    },
  }) as typeof result;
}

/** Export two concrete objects */
export const SERVER_ENVS = createServerEnvs();   // ✔ server-only keys like RESEND_API_KEY
export const PUBLIC_ENVS = createPublicEnvs();   // ✔ only NEXT_PUBLIC_* + DEBUG + flags

// (Optional) If you still want a single export, it must be a union:
export const ENVS: typeof SERVER_ENVS | typeof PUBLIC_ENVS =
  typeof window === "undefined" ? SERVER_ENVS : PUBLIC_ENVS;
