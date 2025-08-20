import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import logger from "@/utils/logger";
import { logAuditEvent } from "@/server/auditTrail";
import { GameResourceData } from "@/lib/types/custom";
import { CreateGameResourceSchema } from "@/app/admin/_lib/adminGameResources";

export async function GET(request: NextRequest): Promise<NextResponse> {
    if (request.method !== "GET") {
    return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
  }
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("game_resources")
    .select("*")
    .is("deleted_at", null)
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    logger.error("Failed to fetch game resources", error);
    return NextResponse.json({ message: "Failed to fetch resources" }, { status: 500 });
  }

  return NextResponse.json(data);
}
  
  export async function POST(request: NextRequest): Promise<NextResponse> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
  
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
      
    const body = await request.json();
    const result = CreateGameResourceSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ message: "Invalid input", errors: result.error.format() }, { status: 400 });
    }
  
    const insertData: Omit<GameResourceData, "id" | "created_at" | "updated_at" | "deleted_at" | "deleted_by" | "games" | "created_by_user"> = {
      ...result.data,
      author_id: user.id,
    };
  
    const { data, error } = await supabase
      .from("game_resources")
      .insert([insertData])
      .select("*")
      .single();
  
    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  
    await logAuditEvent({
      action: "create",
      actor_id: user.id,
      target_type: "game_resource",
      target_id: data.id,
      summary: `Created game resource ${data.title}`,
      metadata: {
        title: data.title,
        body: data.body,
        author_id: data.author_id,
        category: data.category,
        visibility: data.visibility,
        pinned: data.pinned,
      }      
    });
  
    return NextResponse.json(data, { status: 201 });
  }