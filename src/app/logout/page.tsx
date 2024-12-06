"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useSupabaseBrowserClient from "@/utils/supabase/client";
import { toast } from "sonner";


const Logout = () => {
    const supabase = useSupabaseBrowserClient();
    const router = useRouter();

  useEffect(() => {
    const logOut = async () => {
      try {
        await supabase.auth.signOut();
      } catch (error) {
        console.error("Could not sign out", error);
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
