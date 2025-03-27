"use client";

import { useEffect, useState } from "react";
import createSupabaseBrowserClient from "./client";
import { useRouter } from 'next/navigation';
import { Session } from "@supabase/supabase-js";
import { jwtDecode, JwtPayload } from 'jwt-decode'
import { getUser } from "@/server/authActions";

export default function useSession() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        // router.push("/login");
        setSession(null);
        return;
      }      
      setSession(session);
    }
    

    checkSession(); // Call the function to check the session

    type JwtPayloadWithRoles = JwtPayload & { roles: string[] };
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, updatedSession) => {
      // logger.log('Event Triggered', event, updatedSession);
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'INITIAL_SESSION') {
        if (updatedSession) {
          const jwt: JwtPayloadWithRoles = jwtDecode(updatedSession?.access_token);
          const roles = jwt?.roles;
          const user = await getUser();
          if (user) updatedSession.user = user;
          updatedSession.user.user_metadata.roles = roles;
          setSession(updatedSession);
        }
      } else if (event === 'SIGNED_OUT') {
        // logger.log('Signed out Event Triggered');
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