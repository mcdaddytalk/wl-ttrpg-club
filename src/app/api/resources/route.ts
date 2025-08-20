import { SupabaseGameResourceListResponse } from "@/lib/types/custom";
import { GMGameResourceDO } from "@/lib/types/data-objects";
import { getDisplayName } from "@/utils/helpers";
import logger from "@/utils/logger";
import { getSignedResourceUrl } from "@/utils/storage";
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
    .select(`
      *,
      games: games!game_resources_game_id_fkey ( 
          id,
          title
      ),
      created_by_user: members!game_resources_created_by_fkey ( 
          id, 
          profiles ( 
              given_name, 
              surname,
              avatar 
          ) 
      )
    `)
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

  const { data: resources, error } = await query as unknown as SupabaseGameResourceListResponse;
  if (error) {
    logger.error("Error fetching resources:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  const enriched: GMGameResourceDO[] = await Promise.all(
      (resources || []).map(async (r) => {
      let downloadUrl: string | null = null;

      if (r.resource_type === "file" && r.storage_path) {
          try {
              downloadUrl = await getSignedResourceUrl(r.storage_path, 3600);
          } catch {
              downloadUrl = null;
          }
      }

      return {
          id: r.id,
          game_id: r.game_id,
          created_by: r.created_by,
          body: r.body,
          title: r.title,
          summary: r.summary,
          category: r.category, 
          visibility: r.visibility, 
          storage_path: r.storage_path || null, 
          updated_at: r.updated_at,
          resource_type: r.resource_type,
          external_url: r.external_url || null,
          download_url: downloadUrl,
          file_name: r.file_name || null,
          game_title: r.games?.title || "Unknown Game",
          uploader_name: r.created_by_user?.profiles ? getDisplayName(r.created_by_user.profiles) : "Unknown User",
          created_at: r.created_at,
          deleted_at: r.deleted_at, 
          deleted_by: r.deleted_by,
          pinned: r.pinned,
      };
      })
  );

  return NextResponse.json(enriched);
}