import AdminDashboarClient from "./AdminDashboardClient";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { fetchMembersFull } from "@/queries/fetchMembers";

export default async function AdminDashboard() {
    const queryClient = new QueryClient();
    const supabase = await createSupabaseServerClient();
    await prefetchQuery(queryClient, fetchMembersFull(supabase));

    return (<HydrationBoundary state={dehydrate(queryClient)}>
        <AdminDashboarClient />
    </HydrationBoundary>);
}