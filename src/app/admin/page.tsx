import AdminDashboarClient from "./AdminDashboardClient";
import { dehydrate, HydrationBoundary, QueryClient, queryOptions } from "@tanstack/react-query";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { fetchMembersFull, fetchRoles } from "@/queries/fetchMembers";

export default async function AdminDashboard() {
    const queryClient = new QueryClient();
    queryClient.prefetchQuery(fetchMembersFull());
    queryClient.prefetchQuery(fetchRoles());

    return (<HydrationBoundary state={dehydrate(queryClient)}>
        <AdminDashboarClient />
    </HydrationBoundary>);
}