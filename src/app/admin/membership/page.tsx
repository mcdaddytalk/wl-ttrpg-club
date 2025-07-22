//import { fetchMembersFull } from "@/queries/fetchMembers";
import logger from "@/utils/logger";
import { defaultMembersParams, getMembersQueryKey } from "../_lib/adminMembers";
import AdminMembersDashboardClient from "./AdminMembersDashboardClient";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { fetchMembersWithParams } from "@/queries/fetchMembers";

export default async function AdminMembersDashboard() {
    const params = defaultMembersParams;
    const supabase = await createSupabaseServerClient();
    const queryClient = new QueryClient();
    const queryKey = getMembersQueryKey(params);
    
    await queryClient.prefetchQuery({
        queryKey,
        queryFn: () => fetchMembersWithParams(supabase, params),
    });

    logger.debug("Dehydrated state: ", dehydrate(queryClient));
    logger.debug("Hydrated state: ", queryClient.getQueryData(queryKey));
    logger.debug("QUERY KEY: ", JSON.stringify(queryKey))
        
    return (<HydrationBoundary state={dehydrate(queryClient)}>
        <AdminMembersDashboardClient />
    </HydrationBoundary>);
}