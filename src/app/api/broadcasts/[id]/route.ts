import { SupabaseBroadcastMessageResponse, SupabaseBroadcastRecipientListResponse  } from "@/lib/types/custom";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type BroadcastParams = {
    id: string;
}

export async function GET(request: NextRequest, { params }: { params: Promise<BroadcastParams> }): Promise<NextResponse> {
    if (request.method !== 'GET') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const { id } = await params;
    if (!id) {
        return NextResponse.json({ message: `Broadcast Message ID is required` }, { status: 403 })
    }
 
    const supabase = await createSupabaseServerClient();
    const { data: broadcast, error: messagesError } = await supabase
        .from('broadcast_messages')
        .select('*')
        .eq('id', id)
        .single() as SupabaseBroadcastMessageResponse;

    if (messagesError) {
        console.error(messagesError);
        return NextResponse.json({ error: messagesError.message }, { status: 500 });
    }

    const { data: recipients, error: recipientsError } = await supabase
        .from('broadcast_recipients')
        .select(`
            *,
            members!inner(
                email
            )
        `)
        .eq('message_id', id) as unknown as SupabaseBroadcastRecipientListResponse;

    if (recipientsError) {
      throw recipientsError;
    } 

    return NextResponse.json({ message: broadcast, recipients }, { status: 200 });
}