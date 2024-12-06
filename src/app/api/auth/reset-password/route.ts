import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  const { accessToken, newPassword } = await req.json();

  if (!accessToken || !newPassword) {
    return NextResponse.json({ error: "Access token and new password are required." }, { status: 400 });
  }

  try {
    const supabase = await createSupabaseServerClient()
     
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ message: "Password updated successfully!" });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
