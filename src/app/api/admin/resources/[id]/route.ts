import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import logger from "@/utils/logger";
import { logAuditEvent } from "@/server/auditTrail";
import { UpdateGameResourceSchema } from "@/app/admin/_lib/adminGameResources";

interface Params {
    id: string;
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<Params> }): Promise<NextResponse> {
    if (request.method !== "PATCH") {
        return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = UpdateGameResourceSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json({ error: "Invalid update payload", details: parsed.error }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
        .from("game_resources")
        .update({
        ...parsed.data,
        updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select("*")
        .single();

    if (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }

    await logAuditEvent({
        action: "update",
        actor_id: user.id,
        target_type: "game_resource",
        target_id: data.id,
        summary: `Updated game resource`,
        metadata: { ...parsed.data },
    });

    return NextResponse.json(data);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<Params> }): Promise<NextResponse> {
    if (request.method !== "DELETE") {
        return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
    }
    const { id } = await params;

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
        .from('game_resources')
        .update({ deleted_at: new Date().toISOString(), deleted_by: user.id })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        logger.error('Error deleting game resource:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    await logAuditEvent({
        action: "delete",
        actor_id: data.author_id!, // fetched or passed along
        target_type: "game_resource",
        target_id: data.id,
        summary: `Deleted game resource`
      });

    return NextResponse.json({ success: true });
}