import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { GameRegistration, Player, SupabaseGameRegistrationListResponse } from "@/lib/types/custom";

type RegistrantsParams = {
  game_id: string;
};

export async function GET(request: NextRequest, { params }: { params: Promise<RegistrantsParams> } ): Promise<NextResponse> {

  if (request.method !== 'GET') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  const { game_id } = await params;
  console.log('Game ID:', game_id);
  if (!game_id) {
    return NextResponse.json({ message: `Game ID is required` }, { status: 403 })
  }

  const supabase = await createSupabaseServerClient();
  const { data: playerData, error: playerError } = await supabase
    .from('game_registrations')
    .select(`
      game_id,
      member_id,
      members(
        id,
        email,
        is_minor,
        profiles (
          id,
          given_name,
          surname,
          phone,
          experience_level,
          avatar
        )
      )        
    `)
    .eq('game_id', game_id) as unknown as SupabaseGameRegistrationListResponse

  if (playerError) {
    console.error('Error fetching players:', playerError);
    return NextResponse.json({ message: playerError.message }, { status: 500 });
  }

  if (!playerData) return NextResponse.json({ message: `No players found` }, { status: 404 });
  
  console.log('Successfully fetched players:',  playerData);

  const players: Player[] = (playerData as unknown as GameRegistration[])?.map((player) => {
    return {
      id: player.member_id,
      email: player.members?.email,
      isMinor: player.members?.is_minor,
      givenName: player.members?.profiles?.given_name ?? '',
      surname: player.members?.profiles?.surname ?? '',
      phoneNumber: player.members?.profiles?.phone,
      experienceLevel: player.members?.profiles?.experience_level,
      avatar: player.members?.profiles?.avatar,
    }
  })

  return NextResponse.json(players, { status: 200 })
  
}

export async function POST(request: NextRequest, { params }: { params: Promise<RegistrantsParams> } ): Promise<NextResponse> {
  
  if (request.method !== 'POST') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  const { game_id } = await params;
  const body = await request.json();
  console.log(body)
  console.log('Game ID:', game_id);
  if (!game_id) {
    return NextResponse.json({ message: `Game ID is required` }, { status: 403 })
  }

  const supabase = await createSupabaseServerClient();

  const { error: playerError } = await supabase
    .from('game_registrations')
    .insert({
      game_id,
      member_id: body.member_id,
      status: body.status || 'awaiting-approval',
      status_note: body.status_note      
    })
  
  if (playerError) {
    console.error('Error registering player:', playerError);
    return NextResponse.json({ message: playerError.message }, { status: 500 });
  }

  return NextResponse.json({ message: `Player registered` }, { status: 200 })
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<RegistrantsParams> } ): Promise<NextResponse> {
  if (request.method !== 'DELETE') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  const { game_id } = await params;
  const body = await request.json();
  console.log(body)
  console.log('Game ID:', game_id);
  if (!game_id) {
    return NextResponse.json({ message: `Game ID is required` }, { status: 403 })
  }

  const supabase = await createSupabaseServerClient();

  const { error: playerError } = await supabase
    .from('game_registrations')
    .delete()
    .eq('game_id', game_id)
    .eq('member_id', body.member_id)

  if (playerError) {
    console.error('Error kicking player:', playerError);
    return NextResponse.json({ message: playerError.message }, { status: 500 });  
  }

  return NextResponse.json({ message: `Player unregistered` }, { status: 200 })
}

export async function PUT(request: NextRequest, { params }: { params: Promise<RegistrantsParams> } ): Promise<NextResponse> {
  if (request.method !== 'PUT') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  const { game_id } = await params;
  const body = await request.json();
  console.log(body)
  console.log('Game ID:', game_id);
  if (!game_id) {
    return NextResponse.json({ message: `Game ID is required` }, { status: 403 })
  }

  const supabase = await createSupabaseServerClient();

  const { error: playerError } = await supabase
    .from('game_registrations')
    .update({
      status: body.status,
      status_note: body.status_note
    })
    .eq('game_id', game_id)
    .eq('member_id', body.member_id)

  if (playerError) {
    console.error('Error registering player:', playerError);
    return NextResponse.json({ message: playerError.message }, { status: 500 });  
  }

  return NextResponse.json({ message: `Player updated` }, { status: 200 })
}