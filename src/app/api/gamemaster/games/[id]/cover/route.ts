import { ALLOWED_EXTENSIONS, MAX_IMAGE_SIZE } from "@/utils/storage";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";



interface Params {
    id: string;
}

export async function POST(request: NextRequest, { params }: { params: Promise<Params> } ): Promise<NextResponse> {
    if (request.method !== "POST") {
        return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
    }

    const { id } = await params;
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { data: member } = await supabase
        .from("members")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

    if (!member) {
        return NextResponse.json({ message: "Member not found" }, { status: 403 });
    }

    const { data: gameData, error: gameError } = await supabase
        .from("games")
        .select("id")
        .eq("id", id)
        .maybeSingle();

    if (!gameData || gameError) {
        return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
        return NextResponse.json({ error: 'Unsupported file type.' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
        return NextResponse.json({ error: 'Only image files are allowed.' }, { status: 400 });
    }

    if (file.size > MAX_IMAGE_SIZE) {
        return NextResponse.json({ error: 'File too large. Max 20MB.' }, { status: 400 });
    }

    const path = `${id}/cover.${ext}`;
    const { error } = await supabase.storage
        .from('game-covers')
        .upload(path, file, { cacheControl: '3600', upsert: true });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data } = supabase.storage.from('game-covers').getPublicUrl(path);
    return NextResponse.json({ publicUrl: data.publicUrl }, { status: 200 });
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

    const { data: gameData, error: gameError } = await supabase
        .from("games")
        .select("id")
        .eq("id", id)
        .maybeSingle();

    if (!gameData || gameError) {
        return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    const { data: list, error: listError } = await supabase.storage
        .from('game-covers')
        .list(id, { limit: 10 });

    if (listError) return NextResponse.json({ error: listError.message }, { status: 500 });
    const file = list?.find((f) => f.name.startsWith('cover.'));
    if (!file) return NextResponse.json({ status: 'No cover image to delete.' }, { status: 204 });

    const { error: deleteError } = await supabase.storage
        .from('game-covers')
        .remove([`${id}/${file.name}`]);

    if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 });
    return NextResponse.json({ status: 'Deleted' }, { status: 200 });
}