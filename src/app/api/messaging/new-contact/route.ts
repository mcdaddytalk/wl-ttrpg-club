import { NextResponse } from 'next/server';
import { NewContactEmail } from '@/components/EmailTemplate';
import { Resend } from 'resend';
import logger from '@/utils/logger';
import { ENVS } from "@/utils/constants/envs"

const resend = new Resend(ENVS.RESEND_API_KEY);

export async function POST(request: Request): Promise<NextResponse> {
  const contactData = await request.json();
  try {
    const { error } = await resend.emails.send({
      from: 'WL-TTRPG <onboarding@kaje.org>',
      to: ['kbtalkin+newcontact+wlttrpg@gmail.com'],
      subject: 'New Contact Form Submission',
      react: NewContactEmail({ ...contactData }),
    });

    if (error) {
      logger.error(error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ status: 200 });
  } catch (error) {
    logger.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
