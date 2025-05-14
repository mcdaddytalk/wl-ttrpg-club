import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/server/getQueryClient";
import { GMScheduleTable } from "./_components/GMScheduleTable";
import { DataTableSkeleton } from "@/components/DataTable/data-table-skeleton";
import { Suspense } from "react";

export default async function GamemasterSchedulesPage() {
  const queryClient = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={
                        <DataTableSkeleton 
                            columnCount={5}
                            rowCount={5}
                            searchableColumnCount={2}
                            filterableColumnCount={2}
                            withPagination={false}
                            cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
                            shrinkZero
                        />    
                    }> 
            <GMScheduleTable />
        </Suspense>
    </HydrationBoundary>
  );
}