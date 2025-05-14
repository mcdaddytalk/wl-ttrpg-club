import { NextResponse, NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabase/server';
import logger from '@/utils/logger';

import { getInitialSession } from '@/server/authActions';
import { SupabaseAdminNoteListResponse } from '@/lib/types/custom';
import { logAuditEvent } from '@/server/auditTrail';
import { AdminNoteDO } from '@/lib/types/data-objects';

export async function GET(request: NextRequest): Promise<NextResponse> {
    if (request.method !== 'GET') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }
    const session = await getInitialSession();
    if (!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { user } = session;
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createSupabaseServerClient();
    const { data: notesData, error: notesError } = await supabase
        .from('admin_notes')
        .select(`
            id,
            note,
            target_type,
            target_id,
            created_at,
            edited_at,
            author:author_id (
                id,
                email,
                profiles (
                given_name,
                surname
                )
            )
        `)
        .is("deleted_at", null)
        .order("created_at", { ascending: false }) as unknown as SupabaseAdminNoteListResponse;

    if (notesError) {
        logger.error('GET /api/admin/notes', notesError);
        return NextResponse.json({ error: notesError.message }, { status: 500 });
    }

    if (!notesData) {
        logger.error('GET /api/admin/notes', 'No data returned');
        return NextResponse.json({ error: 'No data returned' }, { status: 500 });
    }

    const notes: AdminNoteDO[] = notesData.map((note) => {
        return {
            id: note.id,
            note: note.note,
            target_type: note.target_type,
            target_id: note.target_id,
            created_at: note.created_at,
            edited_at: note.updated_at,
            author_id: note.author_id,
            author_email: note.author.email,
            author: {
                id: note.author.id,
                email: note.author.email,
                displayName: `${note.author.profiles.given_name} ${note.author.profiles.surname}`,
            }
        }
    });
    
    return NextResponse.json(notes, { status: 200 });    
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    if (request.method !== 'POST') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const body = await request.json() as AdminNoteDO;
    const { note, target_type, target_id } = body;

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
        .from('admin_notes')
        .insert({
            note,
            target_type,
            target_id,
            author_id: user.id
        })
        .select()
        .single();

    if (error) {
        logger.error('POST /api/admin/notes', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
        logger.error('POST /api/admin/notes', 'No data returned');
        return NextResponse.json({ error: 'No data returned' }, { status: 500 });
    }

    await logAuditEvent({
        action: "create",
        actor_id: data.author_id,
        target_type: data.target_type,
        target_id: data.target_id,
        summary: `Created admin note`,
        metadata: { note: data.note },
      });

    return NextResponse.json(data, { status: 201 });
}
