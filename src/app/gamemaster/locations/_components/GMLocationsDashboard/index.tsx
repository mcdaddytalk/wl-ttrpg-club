"use client"

import { DataTableSkeleton } from "@/components/DataTable/data-table-skeleton";
import { Shell } from "@/components/Shell";
import React from "react";
import GMLocationsTable from "../GMLocationsTable";
import useSession from "@/utils/supabase/use-session";
import { Button } from "@/components/ui/button";
import { useGamemasterLocations } from "@/hooks/gamemaster/useGamemasterLocations";
import { usePaginationQueryParams } from "@/hooks/usePaginationQueryParams";

export default function GMLocationsDashboard(): React.ReactElement {
    const session = useSession();
    const gamemaster = session?.user;

    const { page, pageSize } = usePaginationQueryParams();
    const { locations, total, isLoading, isError, refetch } = useGamemasterLocations({
      page,
      pageSize,
    });
    
    if (isError) {
      return (
        <>
          <p className="text-center text-sm text-muted-foreground">Something went wrong while loading your locations.</p>;
          <Button variant="outline" onClick={() => refetch()}>
            Try Again
          </Button>
        </>
      )
    }
              
    return (
        <Shell className="gap-2">
            {isLoading && !locations.length ? (
                <DataTableSkeleton 
                    columnCount={5}
                    rowCount={pageSize}
                    searchableColumnCount={2}
                    filterableColumnCount={2}
                    withPagination={true}
                    cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
                    shrinkZero
                />
            ) : (
                <GMLocationsTable 
                    locations={locations || []}
                    total={total}
                    gamemaster={gamemaster!}
                />
            )}
        </Shell>
    )
}
