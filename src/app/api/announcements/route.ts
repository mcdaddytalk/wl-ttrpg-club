import { sendInternalAnnouncementMessage } from "@/lib/notifications/sendInternalAnnouncementMessage";
import { AnnouncementDO, SupabaseAnnouncementListResponse, SupabaseAnnouncementResponse } from "@/lib/types/custom";
import { AnnouncementQuerySchema } from "@/lib/validation/announcements";
import logger from "@/utils/logger";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";


export async function GET(request: NextRequest): Promise<NextResponse> {
    if (request.method !== 'GET') {
            return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    logger.debug("Active schema source:");
    logger.debug(AnnouncementQuerySchema.toString());
    logger.debug('GET /api/announcements  pre-parse', request.nextUrl.searchParams.toString());
    const result = AnnouncementQuerySchema.safeParse(
        Object.fromEntries(request.nextUrl.searchParams.entries())
      );
    
      if (!result.success) {
        logger.error("Invalid query params:", result.error);
        return NextResponse.json({ message: "Invalid query parameters", errors: result.error.format() }, { status: 400 });
      }
    
    logger.debug('GET /api/announcements  post-parse', result.data);

    // TESTING BEGIN
      const testResult = AnnouncementQuerySchema.safeParse({
          published: 'false'
      })

      logger.debug('GET /api/announcements  test-parse', testResult.data);

      const test = z.object({
        published: z.string().transform(value => {
            if (value === "true") {
              return true;
            } else if (value === "false") {
              return false;
            } else {
              throw new Error("The string must be 'true' or 'false'");
            }
          }),
      });
      
      const raw = Object.fromEntries(request.nextUrl.searchParams.entries());
      const parsed = test.safeParse(raw);
      logger.debug("raw published string:", `"${raw.published}"`);
      logger.debug("Manual parse result:", parsed);

    // TESTING END

    const { title, audience, pinned, published, page, limit } = result.data;
    const offset = (page - 1) * limit;
    

    const supabase = await createSupabaseServerClient();

    let query = supabase
        .from('announcements')
        .select('*', { count: "exact" })
        .is('deleted_at', null)

    if (published) {
        query = query.lte('published_at', new Date().toISOString());
    }
    if (title) {
        query = query.ilike("title", `%${title}%`);
    }
    if (audience) {
        query = query.eq("audience", audience);
    }
    if (pinned !== undefined) {
        query = query.eq("pinned", pinned);
    }
    
    query = query
        .order('pinned', { ascending: false })
        .order('published_at', { ascending: false })
        .range(offset, offset + limit - 1);

    const { data: announcementData, count, error: announcementError } = await query as unknown as SupabaseAnnouncementListResponse;
    
    if (announcementError) {
        logger.error(announcementError);
        return NextResponse.json({ message: announcementError.message }, { status: 500 });
    }
    
    const announcements: AnnouncementDO[] = announcementData || [];

    return NextResponse.json({ data: announcements || [], total: count ?? 0 }, { status: 200 });
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
        logger.error(result.error);
        logger.error(body);
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