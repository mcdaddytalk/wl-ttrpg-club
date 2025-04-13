import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import logger from "@/utils/logger";

interface Params {
    id: string;
}

export async function POST(request: NextRequest, { params }: { params: Promise<Params> }) {
    if (request.method !== 'POST') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const { id } = await params;

    if (!id) {
        return NextResponse.json({ message: `Invite ID is required` }, { status: 403 })
    }

    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
        .from('game_invites')
        .update({ notified: true })
        .eq('id', id);

    if (error) {
        logger.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Invite notified successfully' }, { status: 200 });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<Params> }) {
    if (request.method !== 'DELETE') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const { id } = await params;

    if (!id) {
        return NextResponse.json({ message: `Invite ID is required` }, { status: 403 })
    }

    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
        .from('game_invites')
        .delete()
        .eq('id', id);

    if (error) {
        logger.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Invite deleted successfully' }, { status: 200 });
}