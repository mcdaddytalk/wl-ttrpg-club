"use client";

import { useEffect, useState } from "react";
import useSupabaseBrowserClient from "./client";
import { useRouter } from 'next/navigation';
import { Session } from "@supabase/supabase-js";
import { jwtDecode, JwtPayload } from 'jwt-decode'

export default function useSession() {
  const router = useRouter();
  const supabase = useSupabaseBrowserClient();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // console.log(`SUPABASE SESSION`, session)
      if (!session) {
        router.push("/login");
      }
      setSession(session);
    }
    

    checkSession(); // Call the function to check the session

    type JwtPayloadWithRoles = JwtPayload & { roles: string[] };
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const jwt: JwtPayloadWithRoles = jwtDecode(session?.access_token);
        const roles = jwt?.roles;
        session.user.user_metadata.roles = roles;
        setSession(session);
      }
      if (event === 'SIGNED_OUT' || !session) {
        setSession(null);
        console.log('SIGNED OUT event detected')
        router.push('/'); // Or '/login'
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };

  }, [router, supabase]);

  return session;
}