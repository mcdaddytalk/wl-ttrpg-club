import { getQueryClient } from "@/server/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import AnnouncementsDashboard from "./_components/AnnoucementTable/AnnouncementTable";
import fetcher from "@/utils/fetcher";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/DataTable/data-table-skeleton";

const AdminAnnouncementsPage = async (): Promise<React.ReactElement> => {
    const queryClient = getQueryClient();
    const searchParams = new URLSearchParams({ published: 'false', page: '1', limit: '5' }); // match your default usage
    const queryKey = ['announcements', searchParams];

    await queryClient.prefetchQuery({
        queryKey,
        queryFn: ({ queryKey }) => {
            const [, searchParams] = queryKey as [string, URLSearchParams];
            return fetcher('/api/announcements', undefined, searchParams)
        }, // match your hook’s queryFn
      });

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
                <AnnouncementsDashboard />
            </Suspense>
        </HydrationBoundary>
    )
}

export default AdminAnnouncementsPage;