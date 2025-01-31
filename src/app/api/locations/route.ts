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
    .select('*');

  if (locationsError) {
    logger.error(locationsError);
    return NextResponse.json({ message: 'Error fetching locations' }, { status: 500 });
  }

  return NextResponse.json(locationsData);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (request.method !== 'POST') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  const supabase = await createSupabaseServerClient();

  const body = await request.json();
  const { scope, created_by, name, address, url, type, gamemasters } = body;

  if (!name || !type) {
    return NextResponse.json({ message: 'Name and Type are required' }, { status: 400 });
  }

  const { data: locationData, error: locationError } = await supabase
    .from('locations')
    .insert({ name, address, url, type, created_by, scope })
    .select('*')
    .single();

  if (locationError) {
    logger.error(locationError);
    return NextResponse.json({ message: 'Error creating location' }, { status: 500 });
  }

  const { error: locationPermsError } = await supabase
    .from('location_perms')
    .insert(gamemasters.map((gm: string) => ({ location_id: locationData.id, gamemaster_id: gm })));

  if (locationPermsError) {
    logger.error(locationPermsError);
    return NextResponse.json({ message: 'Error creating location permissions' }, { status: 500 });
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