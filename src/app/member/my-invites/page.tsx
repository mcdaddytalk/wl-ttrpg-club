import { Suspense } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PendingInvitesList } from "./_components/PendingInvitesList";

export default function MyInvitesPage() {
  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>My Game Invitations</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<p>Loading invites...</p>}>
            <PendingInvitesList />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
