"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import createSupabaseBrowserClient from "@/utils/supabase/client";
import { toast } from "sonner";
import logger from '@/utils/logger';


const Logout = () => {
    const supabase = createSupabaseBrowserClient();
    const router = useRouter();

  useEffect(() => {
    const logOut = async () => {
      try {
        await supabase.auth.signOut();
      } catch (error) {
        logger.error("Could not sign out", error);
        toast.error("Could not sign out");
      } finally {
        router.replace("/");
      }
    };

    logOut();
  }, [router, supabase]);

  return <></>;
};

export default Logout;
