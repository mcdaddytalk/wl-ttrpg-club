"use client";

// import { supabase } from "@/lib/supabaseClient";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/router";
import { Button } from "./ui/button";

export default function LogoutButton() {
    const supabase = createClient();    
    const router = useRouter();
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) alert('Error logging out: ' + error.message);
        else router.push('/login');
    };

    return (
        <Button onClick={handleLogout}>Logout</Button>
    );
}