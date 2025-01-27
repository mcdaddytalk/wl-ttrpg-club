import { DeliveryMethod, SupabaseBroadcastMessageListResponse, SupabaseBroadcastMessageResponse } from "@/lib/types/custom";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
    if (request.method !== 'GET') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const supabase = await createSupabaseServerClient();
    const { data: messages, error: messagesError } = await supabase
        .from('broadcast_messages')
        .select('*')
        .order('created_at', { ascending: false }) as unknown as SupabaseBroadcastMessageListResponse;

    if (messagesError) {
        console.error(messagesError);
        return NextResponse.json({ error: messagesError.message }, { status: 500 });
    }

    return NextResponse.json(messages, { status: 200 });
}

type MessagePayload = {
    sender_id: string;
    game_id?: string;
    subject: string;
    message: string;
    mode: DeliveryMethod;
}
export async function POST(request: NextRequest): Promise<NextResponse> {
    if (request.method !== 'POST') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const { sender_id, game_id, subject, message, mode, recipients } = await request.json();

    if (!subject || !message || !mode || !recipients || recipients.length === 0) {
      return NextResponse.json({ error: 'Subject, message, mode and recipients are required' }, { status: 400 });
    }
    
    const supabase = await createSupabaseServerClient();

    let messagePayload: MessagePayload = {
      sender_id,
      subject,
      message,
      mode
    }

    if (game_id) {
      messagePayload = {
        ...messagePayload,
        game_id
      }
    }

    const { data: broadcast, error: messageError } = await supabase
        .from('broadcast_messages')
        .insert([messagePayload])
      .select()
      .single() as SupabaseBroadcastMessageResponse;

    if (messageError) {
        console.error(messageError);
        return NextResponse.json({ error: messageError.message }, { status: 500 });
    }

    const { error: recipientsError } = await supabase
        .from('broadcast_recipients')
        .insert(recipients.map((recipient: string) => ({ message_id: broadcast.id, recipient_id: recipient, delivery_method: mode })));

    if (recipientsError) {
        console.error(recipientsError);
        return NextResponse.json({ error: recipientsError.message }, { status: 500 });
    }

    return NextResponse.json( broadcast, { status: 201 });
}