import { SERVER_ENVS as ENVS } from "@/utils/constants/envs";
import logger from "@/utils/logger";
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
    const authHeader = req.headers.get('authorization');
    const isBearer = !!authHeader && authHeader.toLowerCase().startsWith("bearer ");

    const cookieStore = await cookies();
    const supabase = createServerClient(
        ENVS.NEXT_PUBLIC_SUPABASE_URL!,
        ENVS.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // anon is fine; header carries user auth when present
        {
        // Only set global Authorization header when we received a Bearer token
        ...(isBearer ? { global: { headers: { Authorization: authHeader! } } } : {}),
        cookies: {
            getAll() {
            return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
            // In route handlers, writing to cookies() updates the outgoing response headers
            cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options);
            });
            },
        },
        }
    );
    // Try to resolve the user from either bearer or cookies
    const { data: userRes, error: userError } = await supabase.auth.getUser();

    if (userError) {
        // Common one: "invalid claim: missing sub claim" -> bad/expired bearer token
        logger.warn(`touch last login: getUser error: ${userError.message}`);
        return NextResponse.json({ ok: false, error: "not_authenticated" }, { status: 401 });
    }

    if (!userRes?.user) {
        // No session (anonymous caller). Not an error for a "touch" endpoint; just report.
        return NextResponse.json({ ok: true, touched: false, reason: "no_session" });
    }

    const { error: rpcError } = await supabase.rpc("touch_member_last_login");

    if (rpcError) {
        logger.error(`touch last login RPC failed: ${rpcError.message}`);
        return NextResponse.json({ ok: false, error: "rpc_failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, touched: true });
}