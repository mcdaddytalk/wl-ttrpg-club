import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { AuthApiError } from "@supabase/supabase-js";
import z from "zod";
import { logAuditEvent } from "@/server/auditTrail";
import { notifyAccountEvent } from "@/server/notifications/accountEmail";

const Body = z.object({
  currentPassword: z.string().min(1).optional(), // optional for users who never had one
  newPassword: z.string().min(8),
});

export async function PATCH(req: NextRequest): Promise<NextResponse> {
  if (req.method !== "PATCH") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const { currentPassword, newPassword } = Body.parse(await req.json());

  const supabase = await createSupabaseServerClient();

  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  // If a password exists, verify first via your DB function
  if (currentPassword) {
    const { data: ok, error: vErr } = await supabase
      .rpc('verify_user_password', { password: currentPassword }); // returns boolean
    if (vErr || !ok) return NextResponse.json({ status: 401, message: 'Reverification failed' });
  }

  // Then set/update password
  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    if (error instanceof AuthApiError && error.status === 422) {
      return NextResponse.json({ error: error.message }, { status: 422 });
    }
    throw new Error(error.message);
  } else {

    if (auth.user.email)
      await notifyAccountEvent({ type: "password_changed", email: auth.user.email });

    await logAuditEvent({
      action: 'password_changed',
      actor_id: auth.user.id,
      target_type: 'member',
      target_id: auth.user.id,
      summary: 'Password updated',
      metadata: { method: 'email' },
    })
    return NextResponse.json({ message: "Password updated successfully!", ok: true });
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
  
  const { currentPassword: oldPassword, newPassword } = Body.parse(await req.json());

  if (!oldPassword || !newPassword) {
    return NextResponse.json({ error: "Old and new passwords are required." }, { status: 400 });
  }

  try {
    const supabase = await createSupabaseServerClient()

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
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

    await logAuditEvent({
      action: "password_changed",
      actor_id: user?.id,
      target_type: "user",
      target_id: user?.id,
      summary: "Password changed",
      metadata: { method: 'email' },
    })

    return NextResponse.json({ message: "Password updated successfully!" });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
