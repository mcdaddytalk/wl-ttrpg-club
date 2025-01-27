import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.SUPABASE_DB_URL // Use your Supabase database URL

if (!connectionString) {
    throw new Error('Missing environment variable: SUPABASE_DB_URL');
}
// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, { prepare: false })
export const db = drizzle(client);