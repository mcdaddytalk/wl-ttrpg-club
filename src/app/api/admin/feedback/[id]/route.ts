import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import logger from "@/utils/logger";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  if (request.method !== "PATCH") {
    return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
  }
  const { id } = params;
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("feedback")
    .update({
      handled: true,
      handled_at: new Date().toISOString(),
      handled_by: user.id,
    })
    .eq("id", id);

  if (error) {
    logger.error("Failed to update feedback", error);
    return NextResponse.json({ message: "Failed to update feedback" }, { status: 500 });
  }

  return NextResponse.json({ message: "Marked as handled" }, { status: 200 });
}
