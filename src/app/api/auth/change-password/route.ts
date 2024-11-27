import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { AuthApiError } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const { oldPassword, newPassword } = await req.json();

  if (!oldPassword || !newPassword) {
    return NextResponse.json({ error: "Old and new passwords are required." }, { status: 400 });
  }

  try {
    const supabase = await createSupabaseServerClient()
    
    const validOldPassword = await supabase.rpc("verify_user_password", {
      password: oldPassword
    });

    if (!validOldPassword) {
      throw new Error("Invalid old password.");
    }
    
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
        if (error instanceof AuthApiError && error.status === 422) {
            return NextResponse.json({ error: error.message }, { status: 422 });
        }
        throw new Error(error.message);
    }

    return NextResponse.json({ message: "Password updated successfully!" });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
