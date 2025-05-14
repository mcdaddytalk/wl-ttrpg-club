'use client'

import { Skeleton } from "@/components/ui/skeleton"
import { useMyPendingInvites } from "@/hooks/member/useMyPendingInvites"
import Link from "next/link"

export function PendingInvitesPreview() {
  const { data: invites, isLoading } = useMyPendingInvites({ summarize: true })

  if (isLoading) {
    return <Skeleton className="h-24 w-full" />
  }

  if (!invites || invites.length === 0) {
    return <p className="text-muted-foreground">No pending invites.</p>
  }

  return (
    <div className="space-y-2">
      {invites.slice(0, 3).map((invite) => (
        <Link key={invite.id} href="/member/my-invites" className="block">
          <div className="rounded-md border p-3 hover:bg-muted transition">
            <div className="font-semibold">{invite.game_title}</div>
            <div className="text-xs text-muted-foreground">
              Invited by {invite.gm_name} on {invite.invited_at ? new Date(invite.invited_at).toLocaleDateString() : "TBD"}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
