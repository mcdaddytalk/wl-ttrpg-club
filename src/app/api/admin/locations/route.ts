import { AdminLocationDO, SupabaseAdminLocationPermListResponse } from "@/lib/types/custom";
import logger from "@/utils/logger";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (request.method !== 'GET') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: locationsData, error: locationsError } = await supabase
    .from('locations')
    .select(`
      *,
      location_perms(
        gamemaster_id,
        members(
          email,
          profiles (
            given_name,
            surname
          )
        )
      )  
    `) as unknown as SupabaseAdminLocationPermListResponse;

  if (locationsError) {
    logger.error(locationsError);
    return NextResponse.json({ message: 'Error fetching locations' }, { status: 500 });
  }

  if (!locationsData) {
    return NextResponse.json({ message: 'Locations not found' }, { status: 404 });
  }

  const locations: AdminLocationDO[] = locationsData.map((location) => {
    return {
      id: location.id,
      name: location.name,
      address: location.address,
      url: location.url,
      type: location.type,
      created_at: location.created_at,
      updated_at: location.updated_at,
      authorized_gamemasters: location.location_perms.map((location_perm) => {
        return {
          id: location_perm.gamemaster_id,
          given_name: location_perm.members?.profiles.given_name || '',
          surname: location_perm.members?.profiles.surname || ''
        }
      }
    )
    }
  })

  return NextResponse.json(locations);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (request.method !== 'POST') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  const supabase = await createSupabaseServerClient();

  const body = await request.json();
  const { name, address, url, type } = body;

  if (!name || !type) {
    return NextResponse.json({ message: 'Name and Type are required' }, { status: 400 });
  }

  const { data: locationData, error: locationError } = await supabase
    .from('locations')
    .insert({ name, address, url, type })
    .select('*')
    .single();

  if (locationError) {
    logger.error(locationError);
    return NextResponse.json({ message: 'Error creating location' }, { status: 500 });
  }

  return NextResponse.json(locationData);
}

export const DELETE = async (request: NextRequest) => {
  if (request.method !== 'DELETE') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  const supabase = await createSupabaseServerClient();

  const body = await request.json();
  const { locationId } = body;

  if (!locationId) {
    return NextResponse.json({ message: 'Location ID is required' }, { status: 400 });
  }

  const { error: locationError } = await supabase
    .from('locations')
    .delete()
    .eq('id', locationId);

  if (locationError) {
    logger.error(locationError);
    return NextResponse.json({ message: 'Error deleting location' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Location deleted successfully' });
};