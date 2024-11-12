"use client";

// import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";
import { Button } from "./ui/button";
import { signOut } from "@/server/authActions";

export default function LogoutButton() {
    const router = useRouter();
    const handleLogout = async () => {
        const { error } = await signOut();
        if (error) alert('Error logging out: ' + error.message);
        else router.push('/login');
    };

    return (
        <Button onClick={handleLogout}>Logout</Button>
    );
}