import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server";

interface Params {
    id: string;
}

export async function POST(request: NextRequest, { params }: { params: Promise<Params> }): Promise<NextResponse> {

    if (request.method !== 'POST') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const { id } = await params;

    const supabase = await createSupabaseServerClient();
    
    const body = await request.json();
    const { note } = body;

    if (!note || !note.trim()) {
        return NextResponse.json({ message: 'Note is required' }, { status: 400 });
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
        .from('admin_notes')
        .insert({ 
            target_type: "member",
            note,
            target_id: id,
            author_id: user.id
        })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}