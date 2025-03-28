import { NextResponse } from "next/server";
import { Resend } from 'resend';
import { ContactUsEmail } from "@/components/EmailTemplate";
import logger from "@/utils/logger";
import { ENVS } from "@/utils/constants/envs";

const resend = new Resend(ENVS.RESEND_API_KEY);

interface ContactData {
    name: string;
    email: string;
    message: string;
}

export async function POST(request: Request): Promise<NextResponse> {
    const contactUsData: ContactData = await request.json();
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

        return NextResponse.json({ status: 200 });
    } catch (error) {
        logger.error(error);
        return NextResponse.json({ error }, { status: 500 });
    }
}