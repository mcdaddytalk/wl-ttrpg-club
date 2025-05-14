"use client"

import { Suspense } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

import { UpcomingGamesPreview } from "@/app/member/_components/UpcomingGamesPreview"
import { PendingInvitesPreview } from "@/app/member/_components/PendingInvitesPreview"
import { MessagesPreview } from "@/app/member/_components/MessagesPreview"
import { ProfileSummary } from "@/app/member/_components/ProfileSummary"

export default function MemberDashboardPage() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
        {/* Row 1: Profile (1/3) + Messages (2/3) */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<p>Loading profile...</p>}>
              <ProfileSummary />
            </Suspense>
          </CardContent>
        </Card>
  
        <Card className="md:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Messages</CardTitle>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/member/messages">
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<p>Loading messages...</p>}>
              <MessagesPreview />
            </Suspense>
          </CardContent>
        </Card>
  
        {/* Row 2: Upcoming Games + Invites */}
        <Card className="md:col-span-2 md:col-start-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Upcoming Games</CardTitle>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/member/my-games">
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<p>Loading games...</p>}>
              <UpcomingGamesPreview />
            </Suspense>
          </CardContent>
        </Card>
  
        <Card className="md:col-span-2 md:col-start-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Game Invitations</CardTitle>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/member/my-invites">
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<p>Loading invites...</p>}>
              <PendingInvitesPreview />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    )
  }