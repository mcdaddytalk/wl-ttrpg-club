import { GMLocationResponse, SupabaseGMLocationPermListResponse } from "@/lib/types/custom";
import logger from "@/utils/logger";
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

  const gm_id = user.id;

  // Parse pagination
  const searchParams = request.nextUrl.searchParams;
  const onlyActive = searchParams.get("active") === "true";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
  const offset = (page - 1) * pageSize;

  // Count total
  const { data: permData, error: permError } = await supabase
    .from("location_perms")
    .select("location_id")
    .eq("gamemaster_id", gm_id);

  if (permError) {
    logger.error("Error fetching location permissions");
    logger.error(permError);
    return NextResponse.json({ message: "Error fetching permissions" }, { status: 500 });
  }

  const locationIds = permData.map((p) => p.location_id);

  if (!locationIds?.length) {
    logger.warn("No locationIds provided");
    return NextResponse.json({ message: "Missing location IDs" }, { status: 400 });
  }

  logger.debug("locationIds", locationIds);

  let countQuery = supabase
    .from("locations")
    .select("id", { count: "exact", head: true })
    .in("id", locationIds);
  
  if (onlyActive) {
      countQuery = countQuery    
        .is("deleted_at", null);
  }
   
  const { data, count, error: countError } = await countQuery;
  
  logger.debug("location data", data);
  logger.debug("location count", count);
  
  if (countError) {
    logger.error("Error fetching location count");
    logger.error(JSON.stringify(countError, null, 2)); // Reveal internal error
    return NextResponse.json({ message: "Error fetching count", details: countError }, { status: 500 });
  }

  let query = supabase
    .from('locations')
    .select(`
        *,
        location_perms(gamemaster_id)
    `)
    .eq('location_perms.gamemaster_id', gm_id)


  if (onlyActive) {
      query = query.eq("scope", "gm").is("deleted_at", null);
  }

  query = query.range(offset, offset + pageSize - 1);

  const { data: locationsData, error: locationsError } = await query as unknown as SupabaseGMLocationPermListResponse;

  if (locationsError) {
    logger.error("Error fetching locations");
    logger.error(locationsError);
    return NextResponse.json({ message: 'Error fetching locations' }, { status: 500 });
  }

  const payload: GMLocationResponse = {
      data: locationsData,
      total: count ?? 0,
      page,
      pageSize
    };
  

  return NextResponse.json(payload, { status: 200 });

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
  
    const gm_id = user.id;

    const body = await request.json();
    const { scope, name, address, url, type, gamemasters } = body;
  
    if (!name || !type) {
      return NextResponse.json({ message: 'Name and Type are required' }, { status: 400 });
    }
  
    const { data: locationData, error: locationError } = await supabase
      .from('locations')
      .insert({ name, address, url, type, scope, created_by: gm_id })
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

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
  
    if (authError || !user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  
    const gm_id = user.id;
  
    const body = await request.json();
    const { locationId } = body;
  
    if (!locationId) {
      return NextResponse.json({ message: 'Location ID is required' }, { status: 400 });
    }
  
    const { error: locationError } = await supabase
      .from('locations')
      .delete()
      .eq('scope', 'gm')
      .eq('created_by', gm_id)
      .eq('id', locationId);
  
    if (locationError) {
      logger.error(locationError);
      return NextResponse.json({ message: 'Error deleting location' }, { status: 500 });
    }
  
    return NextResponse.json({ message: 'Location deleted successfully' });
  };