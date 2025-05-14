import { SupabaseContactListResponse } from "@/lib/types/custom";
import { ContactListDO } from "@/lib/types/data-objects";
import logger from "@/utils/logger";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (request.method !== 'GET') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: gamemastersData, error: gamemastersError } = await supabase
    .from('members')
    .select(`
      id,
      profiles (
        given_name,
        surname
      ),
      member_roles (
        id,
        role_id
      )      
    `)
    .eq('member_roles.role_id', '8be78726-2ecf-4f19-b58b-9535eebd7704') as unknown as SupabaseContactListResponse;

  if (gamemastersError) {
    logger.error(gamemastersError);
    return NextResponse.json({ message: 'Error fetching gamemasters' }, { status: 500 });
  }

  if (!gamemastersData) {
    return NextResponse.json({ message: 'Gamemasters not found' }, { status: 404 });
  }

  const gamemasters: ContactListDO[] = gamemastersData.filter((gamemaster) => gamemaster.member_roles && gamemaster.member_roles.length > 0).map((gamemaster) => {
    return {
        id: gamemaster.id,
        given_name: gamemaster.profiles.given_name || '',
        surname: gamemaster.profiles.surname || ''
    }
  })

  return NextResponse.json(gamemasters);
}
