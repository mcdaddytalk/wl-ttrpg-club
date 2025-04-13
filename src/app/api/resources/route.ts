import logger from "@/utils/logger";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (request.method !== "GET") {
    return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
  }
  const supabase = await createSupabaseServerClient();
  const urlParams = request.nextUrl.searchParams;

  const visibilities = urlParams.getAll("visibility");
  const onlyPublished = urlParams.get("published") === "true";
  const excludeDeleted = urlParams.get("deleted") !== "false";

  let query = supabase
    .from("game_resources")
    .select("*")
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false });

  if (onlyPublished) {
    query = query.lte("created_at", new Date().toISOString());
  }

  if (excludeDeleted) {
    query = query.is("deleted_at", null);
  }

  if (visibilities.length > 0) {
    query = query.in("visibility", visibilities);
  }

  const { data, error } = await query;
  if (error) {
    logger.error("Error fetching resources:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}