import { ResourceCategory, ResourceType, ResourceVisibility, SupabaseGameResourceListResponse } from "@/lib/types/custom";
import { GMGameResourceDO } from "@/lib/types/data-objects";
import { getDisplayName } from "@/utils/helpers";
import { getSignedResourceUrl, uploadGameResource } from "@/utils/storage";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
    if (request.method !== 'GET') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const supabase = await createSupabaseServerClient();
      
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();
    
    if (authError || !user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get("game_id");

    const query = supabase
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
        .eq("created_by", user.id);

    if (gameId) query.eq("game_id", gameId);

    const { data: resources, error } = await query as unknown as SupabaseGameResourceListResponse;

    if (error) throw error;

    // Generate signed URLs for file resources
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

export async function POST(request: NextRequest): Promise<NextResponse> {
    if (request.method !== 'POST') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const supabase = await createSupabaseServerClient();
      
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();
    
    if (authError || !user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const gameId = formData.get("gameId") as string;
    const title = formData.get("title") as string;
    const summary = formData.get("summary") as string;
    const visibility = formData.get("visibility") as ResourceVisibility;
    const category = formData.get("category") as ResourceCategory;
    const resourceType = formData.get("resourceType") as ResourceType;
    const file = formData.get("file") as File | null;

    let storagePath: string | null = null;
    if (file) {
        storagePath = await uploadGameResource(file, user.id, gameId);
    }

    const { error } = await supabase.from("game_resources").insert({
        game_id: gameId,
        created_by: user.id,
        title,
        resource_type: resourceType,
        summary,
        visibility,
        category,
        file_name: file?.name || null,
        storage_path: storagePath,
    });

    if (error) throw error;

    return NextResponse.json({ message: "Resource uploaded successfully" });
}