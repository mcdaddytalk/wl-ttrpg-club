import { SupabaseLocationPermListResponse } from "@/lib/types/custom";
import logger from "@/utils/logger";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type GamemasterParams = {
    gm_id: string;
}

export async function GET(request: NextRequest, { params }: { params: Promise<GamemasterParams> } ): Promise<NextResponse> {
  if (request.method !== 'GET') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  const { gm_id } = await params;    
  if (!gm_id) {
    return NextResponse.json({ message: `GM ID is required` }, { status: 403 })
  }

  const supabase = await createSupabaseServerClient();
  const { data: locationsData, error: locationsError } = await supabase
    .from('locations')
    .select(`
        *,
        location_perms(
          gamemaster_id
        )
    `)
    .eq('location_perms.gamemaster_id', gm_id) as unknown as SupabaseLocationPermListResponse;

  if (locationsError) {
    logger.error(locationsError);
    return NextResponse.json({ message: 'Error fetching locations' }, { status: 500 });
  }

  if (!locationsData) {
    return NextResponse.json({ message: 'No locations found' }, { status: 404 });
  }

  logger.info(`Found ${locationsData.length} locations for GM ${gm_id}`);
  logger.info(locationsData);
  
  return NextResponse.json(locationsData);

}