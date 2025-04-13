import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabase/server';
import logger from '@/utils/logger';
import { z } from 'zod';
import { logAuditEvent } from '@/server/auditTrail';

interface Params {
    id: string;
}

const updateNoteSchema = z.object({
    note: z.string().min(1),
  });

export async function PATCH(request: NextRequest, { params }: { params: Promise<Params> }): Promise<NextResponse> {
    const { id } = await params;
    const body = await request.json();
    const { note } = body;
    const parsed = updateNoteSchema.safeParse(body);

    if (!note || !parsed.success) {
        return NextResponse.json({ error: 'Note is required' }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('admin_notes')
        .update({ ...parsed.data, edited_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        logger.error('Error updating admin note:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await logAuditEvent({
        action: "update",
        actor_id: data.author_id, // fetched or passed along
        target_type: "admin_note",
        target_id: data.id,
        summary: `Updated admin note`,
        metadata: { note: data.note },
      });

    return NextResponse.json(data);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<Params> }): Promise<NextResponse> {
    if (request.method !== "DELETE") {
        return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
    }
    const { id } = await params;

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('admin_notes')
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        logger.error('Error deleting admin note:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    await logAuditEvent({
        action: "delete",
        actor_id: data.author_id, // fetched or passed along
        target_type: "admin_note",
        target_id: data.id,
        summary: `Deleted admin note`
      });

    return NextResponse.json({ success: true });
}