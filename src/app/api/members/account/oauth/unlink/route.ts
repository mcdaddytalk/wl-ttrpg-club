import { logAuditEvent } from "@/server/auditTrail";
import { notifyAccountEvent } from "@/server/notifications/accountEmail";
import logger from "@/utils/logger";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";


const Body = z.object({ identityId: z.string().uuid() });

export async function PATCH(req: NextRequest): Promise<NextResponse> {
    if (req.method !== "PATCH") {
        return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }

    const { identityId } = Body.parse(await req.json());

    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const identities = user.identities ?? [];
    if (identities.length <= 1) {
        return NextResponse.json({ message: "You cannot unlink the only sign-in method." }, { status: 400 });
    }

    const identity = identities.find(i => i.identity_id === identityId);
    if (!identity) {
        return NextResponse.json({ message: "Identity not found" }, { status: 404 });
    }

    const { error } = await supabase.auth.unlinkIdentity(identity);

    if (error) {
        logger.error("Failed to unlink identity", error);
        return NextResponse.json({ message: "Failed to unlink identity" }, { status: 500 });
    }

    if (user.email)
        await notifyAccountEvent({ type: 'provider_unlinked', email: user.email, provider: identity.provider });

    await logAuditEvent({
        action: 'provider_unlinked',
        actor_id: user.id,
        target_type: 'member',
        target_id: user.id,
        summary: `Unlinked ${identity.provider}`,
        metadata: { provider: identity.provider },
    });

    return NextResponse.json({ message: "Identity unlinked successfully!", ok: true }, { status: 200 });
}