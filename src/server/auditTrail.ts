
import { AuditTrailDO } from "@/lib/types/data-objects";
import logger from "@/utils/logger";
import { createSupabaseServerClient } from "@/utils/supabase/server";


type LogAuditParams = {
  action: AuditTrailDO["action"];
  actor_id: string;
  target_type: string;
  target_id: string;
  summary?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;
};

export async function logAuditEvent(input: Omit<LogAuditParams, 'actor_id'> & { actor_id?: string }) {
  const supabase = await createSupabaseServerClient();
  const {
    action,
    actor_id,
    target_type,
    target_id,
    summary,
    metadata,
  } = input;
  let actor = actor_id;
  if (!actor) {
    const { data: { user } } = await supabase.auth.getUser();
    actor = user?.id ?? undefined;
  }
   
  logger.debug("Audit trail logging:", {
      action,
      actor_id: actor,
      target_type,
      target_id,
      summary,
      metadata,
    });

  const { error } = await supabase.from("audit_trail").insert([
    {
      action,
      actor_id: actor,
      target_type,
      target_id,
      summary,
      metadata,
    },
  ]);

  if (error) console.error("Audit event logging failed:", error.message);
}

// export async function logAuditEvent({
//   action,
//   actor_id,
//   target_type,
//   target_id,
//   summary,
//   metadata,
// }: LogAuditParams) {
//   const supabase = await createSupabaseServerClient();

//   logger.debug("Audit trail logging:", {
//       action,
//       actor_id,
//       target_type,
//       target_id,
//       summary,
//       metadata,
//     });

//   const { error } = await supabase.from("audit_trail").insert([
//     {
//       action,
//       actor_id,
//       target_type,
//       target_id,
//       summary,
//       metadata,
//     },
//   ]);

//   if (error) console.error("Audit event logging failed:", error.message);
// }
