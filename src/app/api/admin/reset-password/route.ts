import { sendPasswordResetEmail } from "@/server/authActions";
import logger from "@/utils/logger";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
    if (request.method !== 'POST') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }
        
    const { email } = await request.json();
    try{ 
        await sendPasswordResetEmail(email);

        return NextResponse.json({ message: "Password reset email sent" }, { status: 200 });
    } catch (error) {
        logger.error("Error sending password reset email:", error);
        return NextResponse.json({ message: "Failed to send password reset email" }, { status: 500 });
    }
}