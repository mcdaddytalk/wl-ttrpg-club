import { Suspense } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function MemberDashboardPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {/* Upcoming Games - spans full width */}
      <div className="md:col-span-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Upcoming Games</CardTitle>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/games">
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<p>Loading games...</p>}>
              <p>[Upcoming games summary here]</p>
            </Suspense>
          </CardContent>
        </Card>
      </div>

      {/* Pending Game Invites */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Game Invitations</CardTitle>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/games/invites">
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<p>Loading invites...</p>}>
            <p>[Invite summary here]</p>
          </Suspense>
        </CardContent>
      </Card>

      {/* Messages */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Messages</CardTitle>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/messages">
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<p>Loading messages...</p>}>
            <p>[Messages preview here]</p>
          </Suspense>
        </CardContent>
      </Card>

      {/* Profile Summary */}
      <div className="md:col-span-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Profile</CardTitle>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/profile">
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<p>Loading profile...</p>}>
              <p>[Profile summary here]</p>
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
