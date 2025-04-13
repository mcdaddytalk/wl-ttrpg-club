"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useGamemasterAnalytics } from "@/hooks/gamemaster/useGamemasterAnalytics";

export default function GamemasterAnalyticsDashboard() {
  const { data, isLoading } = useGamemasterAnalytics();

  if (isLoading || !data) {
    return <Skeleton className="w-full h-[300px] rounded-lg" />;
  }

  const { totalGames, activeGames, upcomingSessions, totalPlayers, registrationStatus, inviteStats } = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Games</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{totalGames}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Games</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{activeGames}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{upcomingSessions}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Players</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{totalPlayers}</p>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Registration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {Object.entries(registrationStatus).map(([status, count]) => (
              <Badge key={status} variant="secondary">
                {status}: {count}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Invite Acceptance Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={inviteStats}>
              <XAxis dataKey="gameTitle" hide />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="accepted" stackId="a" fill="#22c55e" name="Accepted" />
              <Bar dataKey={(data) => data.total - data.accepted} stackId="a" fill="#f97316" name="Unaccepted" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
