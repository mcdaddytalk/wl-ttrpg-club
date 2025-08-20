import { logAuditEvent } from "@/server/auditTrail";
import { notifyAccountEvent } from "@/server/notifications/accountEmail";
import logger from "@/utils/logger";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";


const Body = z.object({ reason: z.string().max(200).optional() });


export async function PATCH(request: NextRequest): Promise<NextResponse> {
    if (request.method !== "PATCH") {
        return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
    }
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = Body.safeParse(body);
    if (!parsed.success) return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });

    const { reason } = parsed.data;

    const { data, error } = await supabase
        .from("members")
        .update({ 
            status: 'soft_deleted', 
            deletion_requested_at: new Date().toISOString(), 
            deletion_reason: reason ?? null
        })
        .eq("id", user.id).select("*").single();

    if (error) {
        logger.error("Failed to soft-delete member", error);
        return NextResponse.json({ message: "Failed to delete member" }, { status: 500 });
    }

    if (user.email)
        await notifyAccountEvent({ type: 'soft_delete_requested', email: user.email, reason });

    await logAuditEvent({
        action: 'account_soft_deleted',
        actor_id: user.id,
        target_type: 'member',
        target_id: user.id,
        summary: 'Soft delete requested',
        metadata: { reason: reason ?? null },
    });

    return NextResponse.json(data);
    
}