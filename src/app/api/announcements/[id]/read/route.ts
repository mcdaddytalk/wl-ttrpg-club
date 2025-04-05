import logger from "@/utils/logger";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type AnnouncementParams = {
    id: string
}

export async function POST(request: NextRequest, { params }: { params: Promise<AnnouncementParams> }): Promise<NextResponse> {
    if (request.method !== 'POST') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const { id } = await params;
    if (!id) {
        return NextResponse.json({ message: `Broadcast Message ID is required` }, { status: 403 })
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
    const { error: announcementError } = await supabase
        .from('announcement_reads')
        .upsert({
            announcement_id: id,
            member_id: user.id,
            read_at: new Date().toISOString(),
        });
    
    if (announcementError) {
        logger.error(announcementError)
        return NextResponse.json({ message: announcementError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Announcement Read created successfully' }, { status: 200 });
}