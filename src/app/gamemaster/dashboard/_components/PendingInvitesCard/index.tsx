"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useGamemasterInvites } from "@/hooks/gamemaster/useGamemasterInvites";
import useSession from "@/utils/supabase/use-session";

export function PendingInvitesCard() {
  const session = useSession();
  const user = session?.user;
  const gamemasterId = user?.id;
  const { data: invites = [], isLoading } = useGamemasterInvites(gamemasterId);

  const pending = invites.filter((invite) => !invite.accepted);

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Pending Invites</CardTitle>
        <Button asChild variant="link" size="sm">
          <Link href="/gamemaster/invites">View All</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        {isLoading ? (
          <p>Loading invites...</p>
        ) : pending.length === 0 ? (
          <p>No pending invites.</p>
        ) : (
          <ul className="space-y-2">
            {pending.slice(0, 5).map((invite) => (
              <li key={invite.id} className="border rounded-md p-2">
                <div className="font-medium text-foreground">{invite.display_name}</div>
                <div className="text-xs">
                  Invited {formatDistanceToNow(new Date(invite.invited_at))} ago
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
