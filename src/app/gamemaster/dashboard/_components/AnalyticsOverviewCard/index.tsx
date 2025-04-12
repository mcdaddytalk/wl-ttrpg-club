"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useGamemasterAnalytics } from "@/hooks/gamemaster/useGamemasterAnalytics";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AnalyticsOverviewCard() {
  const { data, isLoading } = useGamemasterAnalytics();

  if (isLoading || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Analytics</CardTitle>
        <Button variant="link" size="sm" asChild>
          <Link href="/gamemaster/analytics">View Full</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p>Total Games: <strong>{data.totalGames}</strong></p>
        <p>Active Games: <strong>{data.activeGames}</strong></p>
        <p>Upcoming Sessions: <strong>{data.upcomingSessions}</strong></p>
        <p>Total Players: <strong>{data.totalPlayers}</strong></p>

        <div className="mt-2">
          <p className="font-semibold mb-1">Registration Status</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(data.registrationStatus).map(([status, count]) => (
              <Badge key={status} variant="outline">
                {status}: {count}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
