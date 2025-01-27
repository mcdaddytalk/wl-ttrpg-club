import { NextResponse, NextRequest } from 'next/server';
import { 
    sendEmail, 
    sendSMS 
} from '@/utils/messaging';
import { createSupabaseServerClient } from '@/utils/supabase/server';
import { BroadcastRecipient, SupabaseBroadcastMessageResponse, SupabaseBroadcastRecipientListResponse } from '@/lib/types/custom';
import { CreateEmailResponse } from 'resend';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';

export async function POST(request: NextRequest): Promise<NextResponse> {
    if (request.method !== 'POST') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }
    try {
        const { messageId } = await request.json();

        if (!messageId) {
        return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
        }

        const supabase = await createSupabaseServerClient();

        // Fetch message and recipients from the database
        const { data: message, error: messageError } = await supabase
        .from('broadcast_messages')
        .select('*')
        .eq('id', messageId)
        .single() as SupabaseBroadcastMessageResponse;

        if (messageError || !message) {
        throw new Error('Message not found.');
        }

        const { data: recipients, error: recipientsError } = await supabase
            .from('broadcast_recipients')
            .select(`
                *,
                members!inner(
                    email,
                    phone                
                )
            `)
            .eq('message_id', messageId) as unknown as SupabaseBroadcastRecipientListResponse;

        if (recipientsError || !recipients.length) {
            throw new Error('No recipients found.');
        }

        console.log('Recipients:', recipients);
        // Send messages
        const results = await Promise.all(
            recipients.map(async (recipient: BroadcastRecipient) => {
                if (recipient.delivery_method === 'email') {
                    return sendEmail(recipient.members.email, message.subject, message.message);
                } else if (recipient.delivery_method === 'sms') {
                    if (!recipient.members.phone) {
                        console.log('No phone number found for recipient:', recipient.members);
                        return sendEmail(recipient.members.email, message.subject, message.message);
                    }
                    return sendSMS(recipient.members.phone, message.message);
                } else if (recipient.delivery_method === 'both') {
                    const result: { email: string | CreateEmailResponse, sms: string | MessageInstance } = {
                        email: 'not sent',
                        sms: 'not sent'
                    }
                    result['email'] = await sendEmail(recipient.members.email, message.subject, message.message);
                    if (recipient.members.phone)
                        result['sms'] = await sendSMS(recipient.members.phone, message.message);
                    return result;
                }
            })
        );

        // Update delivery status in the database
        await Promise.all(
        results.map((result, index) =>
            supabase
            .from('broadcast_recipients')
            .update({ delivery_status: 'sent' })
            .eq('id', recipients[index].id)
        )
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error broadcasting message:', error);
        return NextResponse.json({ error }, { status: 500 });
    }
}
