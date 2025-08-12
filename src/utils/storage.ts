// import createSupabaseBrowserClient from "@/utils/supabase/client";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export const MAX_IMAGE_SIZE = 20 * 1024 * 1024; // 20 MB
export const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

/**
 * Uploads a file to the Supabase storage bucket under the correct path
 * @param file The file to upload
 * @param userId The ID of the uploading user
 * @param gameId The ID of the game the file belongs to
 * @returns The storage path or throws an error
 */
export async function uploadGameResource(file: File, userId: string, gameId: string): Promise<string> {
  const path = `${userId}/${gameId}/${file.name}`;
  const supabase = await createSupabaseServerClient();
  
  const { data, error } = await supabase.storage
    .from("game-resources")
    .upload(path, file, {
      upsert: false, // prevent overwriting
    });

  if (error) throw error;
  return data.path; // store this in the DB
}

/**
 * Returns a signed URL for a stored resource
 * @param storagePath The storage path (user_id/game_id/file)
 * @param expiresIn Seconds before the URL expires (default: 3600)
 */
export async function getSignedResourceUrl(storagePath: string, expiresIn = 3600): Promise<string> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.storage
        .from("game-resources")
        .createSignedUrl(storagePath, expiresIn);

    if (error) throw error;
    return data.signedUrl;
}

/**
 * Uploads a game cover image to the `game-covers` bucket under /<gameId>/<filename>
 * Enforces file type and size restrictions.
 */
export async function uploadGameCover(gameId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    throw new Error("Only JPG, PNG, or WEBP images are allowed.");
  }

  if (!file.type.startsWith('image/')) {
    throw new Error("Only image files are allowed.");
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("File size exceeds 20 MB limit.");
  }

  const path = `${gameId}/cover.${ext}`;
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.storage
    .from("game-covers")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) throw error;

  const { data } = supabase.storage.from("game-covers").getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Deletes the current cover image for a game
 */
export async function deleteGameCover(gameId: string): Promise<void> {
  const supabase = await createSupabaseServerClient();

  const { data: list, error: listError } = await supabase.storage
    .from("game-covers")
    .list(gameId, { limit: 10 });

  if (listError) throw listError;
  if (!list || list.length === 0) return;

  const coverFile = list.find((file) => file.name.startsWith("cover."));
  if (!coverFile) return;

  const { error: deleteError } = await supabase.storage
    .from("game-covers")
    .remove([`${gameId}/${coverFile.name}`]);

  if (deleteError) throw deleteError;
}

/**
 * Returns a public URL to a stored cover image
 */
export async function getPublicCoverUrl(path: string): Promise<string> {
  const supabase = await createSupabaseServerClient();
  const { data } = supabase.storage.from("game-covers").getPublicUrl(path);
  return data.publicUrl;
}