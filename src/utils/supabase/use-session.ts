"use client";

import { useEffect, useState } from "react";
import useSupabaseBrowserClient from "./client";
import { useRouter } from 'next/navigation';
import { Session } from "@supabase/supabase-js";
import { jwtDecode, JwtPayload } from 'jwt-decode'
import { getUser } from "@/server/authActions";

export default function useSession() {
  const router = useRouter();
  const supabase = useSupabaseBrowserClient();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        setSession(null);
        return;
      }      
      setSession(session);
    }
    

    checkSession(); // Call the function to check the session

    type JwtPayloadWithRoles = JwtPayload & { roles: string[] };
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'INITIAL_SESSION') {
        if (session) {
          const jwt: JwtPayloadWithRoles = jwtDecode(session?.access_token);
          const roles = jwt?.roles;
          const user = await getUser();
          if (user) session.user = user;
          session.user.user_metadata.roles = roles;
        }
        setSession(session);
      }
      if (event === 'SIGNED_OUT' || !session) {
        setSession(null);
        router.push('/'); // Or '/login'
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };

  }, [router, supabase]);

  return session;
}