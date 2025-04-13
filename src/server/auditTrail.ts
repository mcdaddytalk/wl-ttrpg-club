
import { AuditTrailDO } from "@/lib/types/custom";
import logger from "@/utils/logger";
import { createSupabaseServerClient } from "@/utils/supabase/server";


type LogAuditParams = {
  action: AuditTrailDO["action"];
  actor_id: string;
  target_type: string;
  target_id: string;
  summary?: string;
  metadata?: Record<string, any>;
};

export async function logAuditEvent({
  action,
  actor_id,
  target_type,
  target_id,
  summary,
  metadata,
}: LogAuditParams) {
  const supabase = await createSupabaseServerClient();

  logger.debug("Audit trail logging:", {
      action,
      actor_id,
      target_type,
      target_id,
      summary,
      metadata,
    });

  const { error } = await supabase.from("audit_trail").insert([
    {
      action,
      actor_id,
      target_type,
      target_id,
      summary,
      metadata,
    },
  ]);

  if (error) console.error("Audit event logging failed:", error.message);
}
