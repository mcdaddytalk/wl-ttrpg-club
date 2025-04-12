// src/app/api/admin/feedback/route.ts
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { FeedbackDO } from "@/lib/types/custom";
import logger from "@/utils/logger";

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (request.method !== "GET") {
    return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
  }
  const supabase = await createSupabaseServerClient();

  const { data: feedback, error } = await supabase
    .from("feedback")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (error) {
    logger.error("Failed to fetch feedback", error);
    return NextResponse.json({ message: "Failed to fetch feedback" }, { status: 500 });
  }

  return NextResponse.json(feedback as FeedbackDO[]);
}
