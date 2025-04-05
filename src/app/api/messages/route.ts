import { MessageDO, SupabaseMessageListResponse } from "@/lib/types/custom";
import logger from "@/utils/logger";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {

    if (request.method !== 'GET') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const method = searchParams.get('method')
    logger.debug('GET /api/messages', { userId, method })

    if (!userId) {
        return NextResponse.json({ message: `User ID is required` }, { status: 403 })
    }

    const supabase = await createSupabaseServerClient();
    let messagesData: MessageDO[] = [];
    let query = supabase
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
        content,
        subject,
        category,
        link_url,
        is_read,
        is_archived,
        created_at
    `)

    const processMessageData = (data: SupabaseMessageListResponse['data']) => {
        return data.map((message) => {
            return {
                id: message.id,
                sender_id: message.sender_id,
                recipient_id: message.recipient_id,
                sender: {
                    id: message.sender.id,
                    given_name: message.sender.profiles.given_name ?? '',
                    surname: message.sender.profiles.surname ?? ''
                },
                recipient: {
                    id: message.recipient.id,
                    given_name: message.recipient.profiles.given_name ?? '',
                    surname: message.recipient.profiles.surname ?? ''
                },
                content: message.content,
                subject: message.subject ?? '',
                category: message.category ?? '',
                link_url: message.link_url ?? '',
                is_read: message.is_read,
                is_archived: message.is_archived,
                created_at: message.created_at
            }
        }) ?? [];
    }

    switch (method) {
        case 'sent': {
            query = query
                .eq('sender_id', userId)
                .eq('is_archived', false)
                .is('deleted_at', null)
                .order('created_at', { ascending: false })

            const { data, error: messagesError } = await query as unknown as SupabaseMessageListResponse;

            if (messagesError) {
                logger.error(messagesError)
                return NextResponse.json({ message: messagesError.message }, { status: 500 });
            }

            messagesData = processMessageData(data);

            break;
        }
        case 'unread': {
            query = query
                .eq('recipient_id', userId)
                .eq('is_archived', false)
                .eq('is_read', false)
                .is('deleted_at', null)
                .order('created_at', { ascending: false })
            const { data, error: messagesError } = await query as unknown as SupabaseMessageListResponse;

            if (messagesError) {
                logger.error(messagesError)
                return NextResponse.json({ message: messagesError.message }, { status: 500 });
            }           
            messagesData = processMessageData(data);
            break; 
        }
        case 'all': {
            query = query
                .eq('recipient_id', userId)
                .eq('is_archived', false)
                .is('deleted_at', null)
                .order('created_at', { ascending: false })

            const { data, error: messagesError } = await query as unknown as SupabaseMessageListResponse;

            if (messagesError) {
                logger.error(messagesError)
                return NextResponse.json({ message: messagesError.message }, { status: 500 });
            }
            messagesData = processMessageData(data)
            break;
        }
        case 'archived':
            break;
        default:
            return NextResponse.json({ message: `Method is required` }, { status: 403 })
    }
    
    return NextResponse.json(messagesData, { status: 200 })
}

export async function POST(request: NextRequest): Promise<NextResponse> {

    if (request.method !== 'POST') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const body = await request.json();
  // logger.log(body)
    
    const { sender, recipient, subject, content } = body;

    const supabase = await createSupabaseServerClient();

    const { error: messageError } = await supabase
        .from('messages')
        .insert({
            sender_id: sender,
            recipient_id: recipient,
            subject,
            content
        })
    
    if (messageError) {
        logger.error(messageError)
        return NextResponse.json({ message: messageError.message }, { status: 500 });
    }

    return NextResponse.json({ message: `Message Sent Successfully`, body }, { status: 200 })
}