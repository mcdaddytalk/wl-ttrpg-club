import { sendInternalAnnouncementMessage } from "@/lib/notifications/sendInternalAnnouncementMessage";
import { SupabaseAnnouncementResponse } from "@/lib/types/custom";
import logger from "@/utils/logger";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

type AnnouncementParams = {
    id: string
}

const UpdateSchema = z.object({
    title: z.string().optional(),
    body: z.string().optional(),
    audience: z.enum(['public', 'members', 'gamemasters', 'admins']).optional(),
    pinned: z.boolean().optional(),
    published: z.boolean().optional(),
    notify_on_publish: z.boolean().optional(),
    published_at: z.string().optional().nullable().refine(
        val => val === null || val === undefined || !isNaN(Date.parse(val)),
        { message: 'Invalid datetime format' }
    ),
    expires_at: z.string().optional().nullable().refine(
        val => val === null || val === undefined || !isNaN(Date.parse(val)),
        { message: 'Invalid datetime format' }
    ),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<AnnouncementParams> }): Promise<NextResponse> {
    if (request.method !== 'PATCH') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }
        
    const { id } = await params;

    if (!id) {
        return NextResponse.json({ message: `Announcement ID is required` }, { status: 403 })
    }

    const supabase = await createSupabaseServerClient();

    const body = await request.json();
    logger.debug(body)
    const parsed = UpdateSchema.safeParse(body);
    if (!parsed.success) {
        logger.error(parsed.error);
        return NextResponse.json({ message: parsed.error.message }, { status: 400 });
    }

    const { data: announcement, error: announcementError } = await supabase
        .from('announcements')
        .update({
            ...parsed.data,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select('*')
        .single() as unknown as SupabaseAnnouncementResponse;

    if (announcementError) {
        logger.error(announcementError);
        return NextResponse.json({ message: announcementError.message }, { status: 500 });
    }

    if (announcement 
        && announcement.notify_on_publish
        && announcement.published
        && (
            announcement.published_at
            && announcement.published_at <= new Date().toISOString()
        )
    ) {
        await sendInternalAnnouncementMessage(announcement);
    }

    return NextResponse.json(announcement, { status: 200 });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<AnnouncementParams> }): Promise<NextResponse> {
    if (request.method !== 'DELETE') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const { id } = await params;

    if (!id) {
        return NextResponse.json({ message: `Announcement ID is required` }, { status: 403 })
    }

    const supabase = await createSupabaseServerClient();

    const { error: announcementError } = await supabase
        .from('announcements')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

    if (announcementError) {
        logger.error(announcementError);
        return NextResponse.json({ message: announcementError.message }, { status: 500 });
    }    

    return NextResponse.json({ message: 'Announcement deleted successfully' });
}