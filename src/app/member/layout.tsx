import React from "react";
import MemberSidebar from "./_components/MemberSidebar";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import SoftDeletedBanner from "@/components/widgets/SoftDeleteBanner";


export default async function MemberLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createSupabaseServerClient();
    const {
        data: { session },
    } = await supabase.auth.getSession();
    
    if (!session) redirect('/login?redirect=/member');

    const { data: member } = await supabase
        .from("members")
        .select("status")
        .eq("id", session.user.id)
        .single();

    const currentPath = (await headers()).get('x-pathname') ?? "";

    if (member?.status === "soft_deleted" && !currentPath.startsWith("/member/account")) {
        redirect("/member/account?restore=1");
    }

    return (
        <div className="flex min-h-screen">
            <MemberSidebar />
            <div className="flex-grow p-6 overflow-auto">
                <SoftDeletedBanner />
                {children}
            </div>
        </div>
    );
}