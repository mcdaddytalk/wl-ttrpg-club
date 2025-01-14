import AdminMembersDashboarClient from "./AdminMembersDashboardClient";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
// import { fetchMembersFull, fetchRoles } from "@/queries/fetchMembers";

export default async function AdminMembersDashboard() {
    const queryClient = new QueryClient();
    
    // try {
    //     await queryClient.prefetchQuery(fetchMembersFull());
    //     await queryClient.prefetchQuery(fetchRoles());
    // } catch (error) {
    //     console.error('Error prefetching queries:', error);
    // }
    
    return (<HydrationBoundary state={dehydrate(queryClient)}>
        <AdminMembersDashboarClient />
    </HydrationBoundary>);
}