import { useQueryClient } from "@/hooks/useQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import GMLocationsDashboard from "./GMLocationsDashboard";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/DataTable/data-table-skeleton";

const GMLocationsPage = (): React.ReactElement => {
    const queryClient = useQueryClient();
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