import { ENVS } from "@/utils/constants/envs";
import logger from "@/utils/logger";
import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
    if (req.method !== 'POST') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    const authHeader = req.headers.get('Authorization');

    const useHeaderAuth = authHeader?.toLowerCase().startsWith('bearer ');

    let supabase;

    if (useHeaderAuth && authHeader) {
        supabase = createServerClient(
        ENVS.NEXT_PUBLIC_SUPABASE_URL!,
            ENVS.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // anon is fine; header carries user auth
        {
            global: { headers: { Authorization: authHeader } },
            cookies: {
            getAll() { return []; },
            setAll() { /* no-op */ },
            },
        }
        );
    } else {
        // Fall back to cookie-based auth if no Authorization header
        // (this will work for normal client->server calls)
        const res = NextResponse.next();
        supabase = createServerClient(
        ENVS.NEXT_PUBLIC_SUPABASE_URL!,
        ENVS.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
            getAll() { return (req as any).cookies?.getAll?.() ?? []; },
            setAll() { /* touch is read-only for cookies; ignore */ },
            },
        }
        );
    }
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
        logger.warn(`touch last login: getUser error: ${userError.message}`);
        return NextResponse.json({ ok: false, error: "not_authenticated" }, { status: 401 });
    }
    if (!user) {
        return NextResponse.json({ ok: true, touched: false, reason: "no_session" });
    }

    const { error } = await supabase.rpc("touch_member_last_login");
    if (error) {
        logger.error(`touch last login RPC failed: ${error.message}`);
        return NextResponse.json({ ok: false, error: "rpc_failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, touched: true });
}