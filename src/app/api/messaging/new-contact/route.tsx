import { NextResponse } from 'next/server';

import { Resend } from 'resend';
import logger from '@/utils/logger';
import { SERVER_ENVS as ENVS } from "@/utils/constants/envs"
import { NewContactEmail } from '@/components/EmailTemplate';
import { contactFormSchema } from '@/components/ContactForm/schema';
import { sendDiscordContactAlert } from '@/lib/notifications/sendDiscordContactAlert';
import { createSupabaseServerClient } from '@/utils/supabase/server';
//import { contactSchema } from '@/lib/validation/contactSchema';

const resend = new Resend(ENVS.RESEND_API_KEY);

export async function POST(request: Request): Promise<NextResponse> {
  const json = await request.json();

  logger.debug('POST /api/messaging/new-contact received', json);

  const parseResult = contactFormSchema.safeParse(json);
  if (!parseResult.success) {
    logger.error(parseResult.error);
    return NextResponse.json(
      { error: 'Invalid contact form submission', issues: parseResult.error.format() },
      { status: 400 }
    );
  }

  const contactData = parseResult.data;
  logger.debug('POST /api/messaging/new-contact parsed', contactData);
  try {
    const { error } = await resend.emails.send({
      from: 'WL-TTRPG <onboarding@kaje.org>',
      to: ['kbtalkin+newcontact+wlttrpg@gmail.com'],
      subject: 'New Contact Form Submission',
      react: <NewContactEmail {...contactData} />,
    });

    if (error) {
      logger.error(error);
      return NextResponse.json({ error }, { status: 500 });
    }

    const supabase = await createSupabaseServerClient();
    const contactName = contactData.firstName + ' ' + contactData.surname;
    const { data: submission, error: submissionError } = await supabase
        .from('contact_submissions')
        .insert([{
            name: contactName,
            email: contactData.email,
            category: 'new contact',
            message: 'New Contact Form Submission'
        }])
        .select('*')
        .single();
    
    if (submissionError || !submission) {
        logger.error(submissionError || 'Failed to save contact submission');
        return NextResponse.json({ error: 'Failed to save contact submission' }, { status: 500 });
    }

    const { id } = submission;

    await sendDiscordContactAlert({
              id,
              name: contactName,
              email: contactData.email,
              category: 'new contact',
              message: 'New Contact Form Submission'
            });

    return NextResponse.json({ status: 200 });
  } catch (error) {
    logger.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

