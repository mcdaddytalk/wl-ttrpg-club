import { NextResponse } from 'next/server';
import { NewContactEmail } from '@/components/EmailTemplate';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request): Promise<NextResponse> {
  const contactData = await request.json();
  try {
    const { error } = await resend.emails.send({
      from: 'WL-TTRPG <onboarding@resend.dev>',
      to: ['delivered@resend.dev'],
      subject: 'New Contact Form Submission',
      react: NewContactEmail({ ...contactData }),
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
