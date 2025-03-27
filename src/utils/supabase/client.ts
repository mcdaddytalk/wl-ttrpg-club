import { createBrowserClient } from '@supabase/ssr';
import type { Database }  from '@/lib/types/supabase';
import type { TypedSupabaseClient } from '@/lib/types/custom';
import { useMemo } from 'react';

let client: TypedSupabaseClient | undefined;

function createSupabaseBrowserClient() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useMemo(getSupabaseBrowserClient, []);
}

function getSupabaseBrowserClient() {
  if (!client) {
    client = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return client;
}
// export function createSupabaseBrowserClient() {
//   return createBrowserClient(
//     ENVS.NEXT_PUBLIC_SUPABASE_URL!,
//     ENVS.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//   )
// }

export default createSupabaseBrowserClient;