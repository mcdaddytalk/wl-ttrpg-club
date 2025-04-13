import { SupabaseGameInviteListResponse } from "@/lib/types/custom";
import logger from "@/utils/logger";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (request.method !== 'GET') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const gm_id = user.id;
  const { data: inviteData, error: inviteError } = await supabase
    .from('game_invites')
    .select(`
        *,
        games!inner (
            title
        )
    `)
    .eq('gamemaster_id', gm_id) as unknown as SupabaseGameInviteListResponse;

    // logger.log('Invites pulled from db:', inviteData);

  if (inviteError) {
    logger.error(inviteError);
    return NextResponse.json({ message: 'Error fetching invites' }, { status: 500 });
  }

  if (!inviteData) {
    return NextResponse.json({ message: 'No invites found' }, { status: 404 });
  }

  // logger.log('Invites fetched:', inviteData);

  return NextResponse.json(inviteData);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (request.method !== 'POST') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const gm_id = user.id;

  const body = await request.json();

  const { game_id, invitee, external_email, external_phone, expires_at } = body;

  if (!game_id || !invitee) {
    return NextResponse.json({ message: 'Game ID and invitee are required' }, { status: 400 });
  }

  const { data: inviteData, error: inviteError } = await supabase
    .from('game_invites')
    .insert([
      {
        game_id,
        invitee,
        external_email,
        external_phone,
        expires_at,
        gamemaster_id: gm_id
      }
    ]);

  if (inviteError) {
    logger.error(inviteError);
    return NextResponse.json({ message: 'Error creating invite' }, { status: 500 });
  }

  return NextResponse.json(inviteData);
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  if (request.method !== 'PUT') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const gm_id = user.id;

  const body = await request.json();

  const { invite_id, ...remainingBody } = body;

  const { data: inviteData, error: inviteError } = await supabase
    .from('game_invites')
    .update(remainingBody)
    .eq('gamemaster_id', gm_id)
    .eq('id', invite_id);

  if (inviteError) {
    logger.error(inviteError);
    return NextResponse.json({ message: 'Error updating invite' }, { status: 500 });
  }

  return NextResponse.json(inviteData);
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  if (request.method !== 'DELETE') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const gm_id = user.id;

  const body = await request.json();
  const { invite_id } = body;

  const { error: inviteError } = await supabase
    .from('game_invites')
    .delete()
    .eq('gamemaster_id', gm_id)
    .eq('id', invite_id);

  if (inviteError) {
    logger.error(inviteError);
    return NextResponse.json({ message: 'Error deleting invite' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Invite deleted successfully' });
}