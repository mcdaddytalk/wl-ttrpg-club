import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server";
// import logger from "@/utils/logger";

interface Params {
    id: string;
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<Params> }): Promise<NextResponse> {
    if (request.method !== 'DELETE') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const { id } = await params;
    const supabase = await createSupabaseServerClient();

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Ensure gamemaster owns the resource
  const { data: resource } = await supabase
    .from("game_resources")
    .select("id, game_id, storage_path")
    .eq("id", id)
    .single();

  if (!resource) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Delete DB record
  await supabase.from("game_resources").delete().eq("id", id);

  // Delete file from storage (if any)
  if (resource.storage_path) {
    await supabase.storage.from("game-resources").remove([resource.storage_path]);
  }

  return NextResponse.json({ message: "Resource deleted" });
}