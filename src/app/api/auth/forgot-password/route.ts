import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { SERVER_ENVS as ENVS } from "@/utils/constants/envs"

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${ENVS.NEXT_PUBLIC_SITE_URL}/reset-password`, // Ensure this matches your reset password page
    });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ message: "Password reset email sent successfully!" });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
