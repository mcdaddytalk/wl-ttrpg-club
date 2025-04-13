"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useGamemasterLocations } from "@/hooks/gamemaster/useGamemasterLocations";

export function LocationsCard() {
  const { locations = [], isLoading } = useGamemasterLocations({ onlyActive: true });

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>My Locations</CardTitle>
        <Button asChild variant="link" size="sm">
          <Link href="/gamemaster/locations">View All</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        {isLoading ? (
          <p>Loading locations...</p>
        ) : locations.length === 0 ? (
          <p>No active locations found.</p>
        ) : (
          <ul className="space-y-2">
            {locations.slice(0, 5).map((loc) => (
              <li key={loc.id} className="border rounded-md p-2">
                <div className="font-medium text-foreground">{loc.name}</div>
                <div className="text-xs">
                  {loc.type} • {loc.url || loc.address || "No address provided"}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
