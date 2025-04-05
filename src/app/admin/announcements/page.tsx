import { useQueryClient } from "@/hooks/useQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import AnnouncementsDashboard from "../_components/AnnoucementTable/AnnouncementTable";
import { Suspense } from "react";

const AdminAnnouncementsPage = (): React.ReactElement => {
    const queryClient = useQueryClient();
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={
                <div>Loading...</div>
            }>
                <AnnouncementsDashboard />
            </Suspense>
        </HydrationBoundary>
    )
}

export default AdminAnnouncementsPage;