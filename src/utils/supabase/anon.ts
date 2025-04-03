import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/types/supabase';

export const createSupabaseAnonClient = () => {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};