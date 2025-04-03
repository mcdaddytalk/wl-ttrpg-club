import { sendInternalAnnouncementMessage } from "@/lib/notifications/sendInternalAnnouncementMessage";
import { AnnouncementDO, SupabaseAnnouncementListResponse, SupabaseAnnouncementResponse } from "@/lib/types/custom";
import logger from "@/utils/logger";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";


export async function GET(request: NextRequest): Promise<NextResponse> {
    if (request.method !== 'GET') {
            return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }
    
    const publishedParam = request.nextUrl.searchParams.get('published');
  const published = publishedParam !== 'false'; // Default to true


    const supabase = await createSupabaseServerClient();

    let query = supabase
        .from('announcements')
        .select('*')
        .is('deleted_at', null)

    if (published)
        query = query.lte('published_at', new Date().toISOString());

    query = query
        .order('pinned', { ascending: false })
        .order('published_at', { ascending: false })

    const { data: announcementData, error: announcementError } = await query as unknown as SupabaseAnnouncementListResponse;
    
    if (announcementError) {
        logger.error(announcementError);
        return NextResponse.json({ message: announcementError.message }, { status: 500 });
    }
    
    const announcements: AnnouncementDO[] = announcementData || [];

    return NextResponse.json(announcements, { status: 200 });
}

const CreateAnnouncementSchema = z.object({
    title: z.string(),
    body: z.string(),
    audience: z.enum(['public', 'members', 'gamemasters', 'admins']),
    pinned: z.boolean().optional().default(false),
    published: z.boolean().optional().default(false),
    notify_on_publish: z.boolean().optional().default(false),
    published_at: z.string().datetime().optional(),
    expires_at: z.string().datetime().optional().nullable(),
  });

export async function POST(request: NextRequest): Promise<NextResponse> {
    if (request.method !== 'POST') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
        error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
        logger.error(userError || 'User not found');
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const result = CreateAnnouncementSchema.safeParse(body);
    if (!result.success) {
        return NextResponse.json({ message: 'Validation failed', errors: result.error.format() }, { status: 400 });
      }
      
    const { data: input } = result;
    const { data: announcement, error: announcementError } = await supabase
        .from('announcements')
        .insert({
            ...input,
            author_id: user.id
        })
        .select('*')
        .single() as unknown as SupabaseAnnouncementResponse;
    
    if (announcementError) {
        logger.error(announcementError)
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
      

    return NextResponse.json({ message: 'Announcement created successfully' }, { status: 200 });
}