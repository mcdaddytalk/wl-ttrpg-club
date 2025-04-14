import { NextResponse } from "next/server";
import { Resend } from 'resend';
import { ContactUsAutoReply, ContactUsEmail } from "@/components/EmailTemplate";
import logger from "@/utils/logger";
import { ENVS } from "@/utils/constants/envs";
import { ContactData } from "@/lib/types/custom";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { checkRateLimit } from "@/server/rate-limit";
import { sendDiscordContactAlert } from "@/lib/notifications/sendDiscordContactAlert";

const resend = new Resend(ENVS.RESEND_API_KEY);

export async function POST(request: Request): Promise<NextResponse> {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';

    if (!checkRateLimit(ip)) {
        return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }
    
    const contactUsData: ContactData = await request.json();
    if (contactUsData && contactUsData.website) {
        logger.warn('Spam submission detected', contactUsData);
        return NextResponse.json({ error: 'Spam detected' }, { status: 400 });
    }
    try {
        const { error } = await resend.emails.send({
            from: 'WL-TTRPG <onboarding@kaje.org>',
            to: ['kbtalkin+contact-us+wttrpg@gmail.com'],
            subject: 'New Contact Us Form Submission',
            react: ContactUsEmail({ ...contactUsData }),
        });

        if (error) {
            logger.error(error);
            return NextResponse.json({ error }, { status: 500 });
        }
        
        const supabase = await createSupabaseServerClient();
        const { data: submission, error: submissionError } = await supabase
            .from('contact_submissions')
            .insert([contactUsData])
            .select('*')
            .single();
        
        if (submissionError || !submission) {
            logger.error(submissionError || 'Failed to save contact submission');
            return NextResponse.json({ error: 'Failed to save contact submission' }, { status: 500 });
        }

        const { id } = submission;

        const { email, name, category, message } = contactUsData;
        await resend.emails.send({
            from: 'WL-TTRPG <wl-ttrpg-contact-us@kaje.org>',
            to: [email],
            subject: 'We Received Your Message',
            react: ContactUsAutoReply({ name }),
        });
        
        sendDiscordContactAlert({ 
            id, 
            email, 
            name, 
            category, 
            message 
        });          

        return NextResponse.json({ status: 200 });
    } catch (error) {
        logger.error(error);
        return NextResponse.json({ error }, { status: 500 });
    }
}