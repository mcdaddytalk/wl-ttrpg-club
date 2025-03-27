import { NextResponse } from 'next/server';

import { Resend } from 'resend';
import logger from '@/utils/logger';
import { ENVS } from "@/utils/constants/envs"
import { NewContactEmail } from '@/components/EmailTemplate';
import { contactSchema } from '@/lib/validation/contactSchema';

const resend = new Resend(ENVS.RESEND_API_KEY);

export async function POST(request: Request): Promise<NextResponse> {
  const json = await request.json();

  const parseResult = contactSchema.safeParse(json);
  if (!parseResult.success) {
    return NextResponse.json(
      { error: 'Invalid contact form submission', issues: parseResult.error.format() },
      { status: 400 }
    );
  }

  const contactData = parseResult.data;
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

    return NextResponse.json({ status: 200 });
  } catch (error) {
    logger.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

