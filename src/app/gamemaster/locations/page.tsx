import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import GMLocationsDashboard from "./_components/GMLocationsDashboard";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/DataTable/data-table-skeleton";
import { getQueryClient } from "@/server/getQueryClient";

const GMLocationsPage = async (): Promise<React.ReactElement> => {
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
                <GMLocationsDashboard />
            </Suspense>
        </HydrationBoundary>
    )
}

export default GMLocationsPage;
