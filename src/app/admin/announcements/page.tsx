import { getQueryClient } from "@/server/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import AnnouncementsDashboard from "./_components/AnnoucementTable/AnnouncementTable";
import fetcher from "@/utils/fetcher";

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
                <AnnouncementsDashboard />
        </HydrationBoundary>
    )
}

export default AdminAnnouncementsPage;