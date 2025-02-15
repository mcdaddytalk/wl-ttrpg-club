import { useQueryClient } from "@/hooks/useQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import GMInvitesDashboard from "./GMInvitesDashboard";
import { DataTableSkeleton } from "@/components/DataTable/data-table-skeleton";
import { Suspense } from "react";

const GMInvitesPage = (): React.ReactElement => {
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
                <GMInvitesDashboard />
            </Suspense>
        </HydrationBoundary>
    )
}

export default GMInvitesPage;