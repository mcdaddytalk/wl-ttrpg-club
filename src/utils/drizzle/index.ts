import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { ENVS } from "@/utils/constants/envs"

const connectionString = ENVS.POSTGRES_URL // Use your Supabase database URL

if (!connectionString) {
    throw new Error('Missing environment variable: POSTGRES_URL');
}
// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, { prepare: false })
export const db = drizzle(client);