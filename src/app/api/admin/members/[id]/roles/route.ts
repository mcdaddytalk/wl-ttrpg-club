import { NextResponse, NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { RoleDO } from "@/lib/types/data-objects";

interface Params {
    id: string;
}

export async function PATCH(request: NextRequest, { params }: { params: Params }): Promise<NextResponse> {
    if (request.method !== 'PATCH') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const { id } = params;

    const body = await request.json();
    const { roles } = body;

    if (!roles) {
        return NextResponse.json({ message: 'Roles is required' }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();

    const { error: memberRolesError } = await supabase
        .from('member_roles')
        .delete()
        .eq('member_id', id);

    if (memberRolesError) {
        return NextResponse.json({ error: memberRolesError.message }, { status: 500 });
    }

    const { error: memberRolesInsertError } = await supabase
        .from('member_roles')
        .insert(roles.map((role: RoleDO) => ({
            member_id: id,
            role_id: role.id
        })));

    if (memberRolesInsertError) {
        return NextResponse.json({ error: memberRolesInsertError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Member roles updated successfully' });
}