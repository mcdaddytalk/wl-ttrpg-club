import { logAuditEvent } from "@/server/auditTrail";
import { notifyAccountEvent } from "@/server/notifications/accountEmail";
import logger from "@/utils/logger";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(request: NextRequest): Promise<NextResponse> {
    if (request.method !== "PATCH") {
        return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
    }
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
        .from("members")
        .update({ 
            status: 'active', 
            deletion_requested_at: null, 
            deletion_reason: null,
            deleted_at: null,
            deleted_by: null
        })
        .eq("id", user.id).select("*").single();

    if (error) {
        logger.error("Failed to restore member", error);
        return NextResponse.json({ message: "Failed to restore member" }, { status: 500 });
    }

    if (user.email)
        await notifyAccountEvent({ type: 'account_restored', email: user.email });

    await logAuditEvent({
        action: 'account_restored',
        actor_id: user.id,
        target_type: 'member',
        target_id: user.id,
        summary: 'Account restored',
        metadata: {},
    });

    return NextResponse.json(data);
}