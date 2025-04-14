export const dynamic = 'force-dynamic';

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/server/getQueryClient";

import AdminTagManager from "./_components/AdminTagManager";
import fetcher from "@/utils/fetcher";
import { TagData } from "@/lib/types/custom";

export default async function AdminTagsPage() {
    const queryClient = getQueryClient();

    await queryClient.prefetchQuery<TagData[]>({
        queryKey: ['admin-tags'],
        queryFn: async () => {
            return fetcher('/api/admin/tags');
        }
    })


    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <AdminTagManager />
        </HydrationBoundary>
    )
}
