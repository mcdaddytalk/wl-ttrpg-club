//import { fetchMembersFull } from "@/queries/fetchMembers";
import logger from "@/utils/logger";
import { defaultMembersParams, getMembersQueryKey } from "../_lib/adminMembers";
import AdminMembersDashboardClient from "./AdminMembersDashboardClient";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { fetchMembersWithParams } from "@/queries/fetchMembers";
import { getUser } from "@/server/authActions";

export default async function AdminMembersDashboard() {
    const params = defaultMembersParams;
    const supabase = await createSupabaseServerClient();
    const queryClient = new QueryClient();
    const queryKey = getMembersQueryKey(params);
    const queryFn = () => fetchMembersWithParams(supabase, params);
    
    await queryClient.prefetchQuery({
        queryKey,
        queryFn
    });

    logger.debug("Dehydrated state: ", dehydrate(queryClient));
    logger.debug("Hydrated state: ", queryClient.getQueryData(queryKey));
    logger.debug("QUERY KEY: ", JSON.stringify(queryKey))

    const user = await getUser();
        
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {user && <AdminMembersDashboardClient user={user} />}
        </HydrationBoundary>
    )
}