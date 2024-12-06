import { SupabaseMessageResponse, type MessageDO } from "@/lib/types/custom";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type MessageParams = {
    id: string
}
export async function GET(request: NextRequest, { params }: { params: Promise<MessageParams> } ): Promise<NextResponse> {
    if (request.method !== 'GET') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }    

    const { id } = await params;
    const supabase = await createSupabaseServerClient();

    const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .select(`
            id,
            sender_id,
            recipient_id,
            sender:members!messages_sender_id_fkey (
                id,
                profiles (
                    given_name,
                    surname
                )
            ),
            recipient:members!messages_recipient_id_fkey (
                id,
                profiles (
                    given_name,
                    surname
                )
            ),
            subject,
            content,
            is_read,
            is_archived,
            created_at
        `)
        .eq('id', id)
        .maybeSingle() as unknown as SupabaseMessageResponse;

    if (messageError) {
        console.error(messageError)
        return NextResponse.json({ message: messageError.message }, { status: 500 });
    }

    if (!messageData) {
        return NextResponse.json({ message: 'Message not found' }, { status: 404 });
    }
    const message: MessageDO = {
        id: messageData.id,
        sender_id: messageData.sender_id,
        sender: {
            id: messageData.sender.id,
            given_name: messageData.sender.profiles?.given_name ?? "",
            surname: messageData.sender.profiles?.surname ?? "",
        },
        recipient_id: messageData.recipient_id,
        recipient: {
            id: messageData.recipient.id,
            given_name: messageData.recipient.profiles?.given_name ?? "",
            surname: messageData.recipient.profiles?.surname ?? "",
        },
        subject: messageData.subject ?? "",
        content: messageData.content  ?? "",
        is_read: messageData.is_read,
        is_archived: messageData.is_archived,
        created_at: messageData.created_at
    };
    return NextResponse.json(message, { status: 200 });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<MessageParams> } ): Promise<NextResponse> {
    if (request.method !== 'DELETE') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const { id } = await params;
    const supabase = await createSupabaseServerClient();

    const { error: messageError } = await supabase
        .from('messages')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

    if (messageError) {
        console.error(messageError)
        return NextResponse.json({ message: messageError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Message deleted'}, { status: 200 });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<MessageParams> } ): Promise<NextResponse> {
    if (request.method !== 'PATCH') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const { id } = await params;
    const body = await request.json();

    if (!id) {
        return NextResponse.json({ message: `Message ID is required` }, { status: 403 })
    }

    const supabase = await createSupabaseServerClient();

    const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .update(body)
        .eq('id', id)
        .select().single();

    if (messageError) {
        console.error(messageError)
        return NextResponse.json({ message: messageError.message }, { status: 500 });
    }

    return NextResponse.json(messageData, { status: 200 });
}

