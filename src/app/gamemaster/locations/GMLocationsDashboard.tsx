"use client"

import { DataTableSkeleton } from "@/components/DataTable/data-table-skeleton";
import { Shell } from "@/components/Shell";
import React from "react";
import GMLocationsTable from "../_components/GMLocationsTable/GMLocationsTable";
import useSession from "@/utils/supabase/use-session";
import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { GMLocationDO } from "@/lib/types/custom";

const fetchLocations = async (gm_id: string): Promise<GMLocationDO[]> => {
    const response = await fetch(`/api/gamemaster/${gm_id}/locations`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  
    switch (response.status) {
      case 500:
        toast.error("Error fetching locations");
        return [];   
      case 404:
        toast.error("Locations not found");
        return [];
      case 200:
        const locations = await response.json();
        return locations as GMLocationDO[] || [];
      default:
        toast.error("Error fetching locations");
        return [];
    }
  }

export default function GMLocationsDashboard(): React.ReactElement {
    const session = useSession();
    const gamemaster: User = (session?.user as User) ?? null;

    const { data: locations, isLoading, isError } = useQuery<GMLocationDO[], Error>({
            queryKey: ['locations', 'gm', 'full', gamemaster?.id],
            queryFn: () => fetchLocations(gamemaster?.id as string),
            enabled: !!gamemaster,
          });
        
    if (isError) {
        toast.error("Error fetching locations");
        return <>Error</>;
    }
              
    return (
        <Shell className="gap-2">
            {isLoading ? (
                <DataTableSkeleton 
                    columnCount={5}
                    rowCount={5}
                    searchableColumnCount={2}
                    filterableColumnCount={2}
                    withPagination={false}
                    cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
                    shrinkZero
                />
            ) : (
                <GMLocationsTable 
                    locations={locations || []}
                    gamemaster={gamemaster}
                />
            )}
        </Shell>
    )
}
