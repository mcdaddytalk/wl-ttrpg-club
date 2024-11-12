import { NextResponse } from "next/server";
import { Resend } from 'resend';
import { ContactUsEmail } from "@/components/EmailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request): Promise<NextResponse> {
    const contactUsData = await request.json();
    try {
        const { error } = await resend.emails.send({
            from: 'WL-TTRPG <contact-us@resend.dev>',
            to: ['delivered@resend.dev'],
            subject: 'New Contact Us Form Submission',
            react: ContactUsEmail({ ...contactUsData }),
        });

        if (error) {
            return NextResponse.json({ error }, { status: 500 });
        }    

        return NextResponse.json({ status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}