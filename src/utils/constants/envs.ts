import { isServer } from "@/lib/is-server";
import { z } from "@/lib/zod";

const flags = {
    IS_PROD: process.env.NODE_ENV === "production",
    IS_DEV: process.env.NODE_ENV === "development",
    IS_TEST: process.env.NODE_ENV === "test"
} as const;

type EnvShape = Omit<ServerEnvs, 'DEBUG' | 'NEXT_PUBLIC_DEBUG'> & {
    DEBUG: boolean;
    NEXT_PUBLIC_DEBUG: boolean;
  } & typeof flags;

// const createEnvs = (
//     parsed: MergedSafeParseReturn,
// ): Record<Exclude<ServerEnvsKeys, 'DEBUG'>, string> & {
//     DEBUG: boolean;
// } & typeof flags => {
const createEnvs = (parsed: MergedSafeParseReturn): EnvShape => {    
    if (!parsed.success) {
        const message = 'Invalid environment variables';
        console.error(`${message}: `, parsed.error.flatten().fieldErrors);
        throw new Error(message)
    }

    const { DEBUG, NEXT_PUBLIC_DEBUG, ...rest } = parsed.data;

    const extendedEnvs: EnvShape = {
        ...rest,
        ...flags,
        DEBUG: isServer() ? DEBUG : NEXT_PUBLIC_DEBUG,
        NEXT_PUBLIC_DEBUG
    }

    const ENVS = new Proxy(extendedEnvs, {
        get(target, prop) {
            if (typeof prop !== 'string') return undefined;

            if (prop in flags) {
                return Reflect.get(target, prop)
            }

            if (!isServer() && !prop.startsWith('NEXT_PUBLIC_') && prop !== 'DEBUG') {
                const errorMessage = 'Not allowed to access server-side environment variables outside server';
                throw new Error(
                    process.env.NODE_ENV === 'production'
                        ? errorMessage
                        : `${errorMessage}: ${prop}`,
                )
            }
            return Reflect.get(target, prop)
        },
    })
    
    return ENVS
}

const clientSchema = z.object({
    NEXT_PUBLIC_DEBUG: z.string().optional().default('false').transform((val) => val.toLowerCase() === 'true'),
})

// Client-side env vars are also available on the server
const serverSchema = z.object({
    DEBUG: z.string().optional().default('false').transform((val) => val.toLowerCase() === 'true'),
    BRAND_NAME: z.string(),
    BRAND_LOGO: z.union([
        z.string().url(),             // absolute URLs
        z.string().regex(/^\/(?!\/).+/) // single-leading-slash relative path like /images/foo.webp
    ]),
    BRAND_EMAIL: z.string().email(),
    SUPPORT_EMAIL: z.string().email(),
    NEXT_PUBLIC_SITE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
    SUPABASE_SERVICE_ROLE_KEY: z.string(),
    S3_STORAGE_ACCESS_KEY: z.string(),
    S3_STORAGE_ACCESS_SECRET: z.string(),
    POSTGRES_PASSWORD: z.string(),
    POSTGRES_URL: z.string().url(),
    RESEND_API_KEY: z.string(),
    TWILIO_ACCOUNT_SID: z.string(),
    TWILIO_AUTH_TOKEN: z.string(),
    TWILIO_API_SID: z.string(),
    TWILIO_API_SECRET: z.string(),
    TWILIO_MESSAGING_SERVICE_SID: z.string(),
    NEXT_PUBLIC_SENTRY_DSN: z.string(),
    SENTRY_AUTH_TOKEN: z.string(),
    DISCORD_WEBHOOK_CONTACT: z.string().url(),
    DISCORD_WEBHOOK_SUPPORT: z.string().url(),
}).merge(clientSchema)

type ServerEnvs = z.infer<typeof serverSchema>
type ClientEnvs = z.infer<typeof clientSchema>
type ServerEnvsKeys = keyof ServerEnvs
type ClientEnvsKeys = keyof ClientEnvs
type PROCESS_ENV = Record<ServerEnvsKeys | ClientEnvsKeys, string | undefined>

type MergedSafeParseReturn = z.SafeParseReturnType<
    z.input<typeof serverSchema>,
    ServerEnvs
>;

const parseEnvs = (
    processEnv: PROCESS_ENV,
    clientSchema: z.ZodSchema,
    serverSchema: z.ZodSchema,
): MergedSafeParseReturn => {
    const schema = isServer() ? serverSchema : clientSchema
    return schema.safeParse(processEnv)
}

const processEnv: PROCESS_ENV = {
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
}

const ENVS = createEnvs(parseEnvs(processEnv, clientSchema, serverSchema))

export { ENVS }