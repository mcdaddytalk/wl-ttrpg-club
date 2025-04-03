import { useQueryClient } from "@/hooks/useQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import AnnouncementsDashboard from "../_components/AnnoucementTable/AnnouncementTable";

const AdminAnnouncementsPage = (): React.ReactElement => {
    const queryClient = useQueryClient();
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <AnnouncementsDashboard />
        </HydrationBoundary>
    )
}

export default AdminAnnouncementsPage;