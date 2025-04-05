import logger from "@/utils/logger";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

interface Params {
    id: string;
}

export async function GET(request: NextRequest, { params }: { params: Promise<Params> }) {
    if (request.method !== 'GET') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const { id } = await params;
    const supabase = await createSupabaseServerClient();
    const { data, error: announcementError } = await supabase
        .from('announcement_reads')
        .select('announcement_id')
        .eq('member_id', id);

    if (announcementError) {
        logger.error(announcementError)
        return NextResponse.json({ message: announcementError.message }, { status: 500 });
    }
  
    return NextResponse.json(data, { status: 200 })
}