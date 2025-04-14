import { NextResponse, NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabase/server';

interface Params {
    id: string;
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<Params> }): Promise<NextResponse> {
    const { id } = await params;
    const body = await request.json();
    const { name } = body;
    
    if (!name || typeof name !== 'string') {
        return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from('tags')
        .update({ name: name.toLowerCase().trim() })
        .eq('id', id)
        .select();
    
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<Params> }): Promise<NextResponse> {
    const { id } = await params;

    const supabase = await createSupabaseServerClient();
    
    const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', id);
    
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
}