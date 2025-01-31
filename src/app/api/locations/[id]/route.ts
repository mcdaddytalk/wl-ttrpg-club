import logger from "@/utils/logger";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type LocationParams = {
    id: string;
}

export async function PUT(request: NextRequest, { params }: { params: Promise<LocationParams> }): Promise<NextResponse> {
    if (request.method !== 'PUT') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const { id } = await params;
    
    const supabase = await createSupabaseServerClient();

    const body = await request.json();
    const { scope, created_by, name, address, url, type } = body;

    if (!name || !type) {
        return NextResponse.json({ message: 'Name and Type are required' }, { status: 400 });
    }

    const { error: locationError } = await supabase
        .from('locations')
        .update({ name, address, url, type, scope, created_by })
        .eq('id', id)
        .select('*')
        .single();

    if (locationError) {
        logger.error(locationError);
        return NextResponse.json({ message: 'Error updating location' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Location updated successfully' }, { status: 200 });
}