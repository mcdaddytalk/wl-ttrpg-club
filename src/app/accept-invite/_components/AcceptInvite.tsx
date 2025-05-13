"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { getInitialSession } from "@/server/authActions";

export default function AcceptInvite(): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteId = searchParams.get("invite");
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function acceptInvite() {
      if (!inviteId) {
        toast.error("Invalid or missing invite.");
        router.push("/games");
        return;
      }

      await fetch(`/api/invites/${inviteId}/view`, { method: "POST" });
      
      const session = await getInitialSession();

      if (!session?.user) {
        setLoading(false);
        toast.error("You must be logged in to accept an invite.");
        router.push(`/login?redirect=/accept-invite?invite=${inviteId}`);
        return;
      }
      try {
        const res = await fetch(`/api/invites/${inviteId}/accept`, { method: "PATCH" });
        const data = await res.json();

        setLoading(false);
        if (res.ok) {
          toast.success("You have successfully joined the game!");
          router.prefetch(`/games/adventure/${data.game_id}`);
          router.push(`/games/adventure/${data.game_id}`);
        } else {
          throw new Error(data.error || "Failed to accept invite.");
        }
      } catch (error) {
        toast.error((error as Error).message || "Failed to accept invite.");
        router.push("/member");
      }
    }

    acceptInvite();
  }, [inviteId, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>{isLoading ? "Processing your invite..." : "Redirecting..."}</p>
    </div>
  );
}
