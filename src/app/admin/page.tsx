import AdminDashboarClient from "./AdminDashboardClient";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
// import { fetchMembersFull, fetchRoles } from "@/queries/fetchMembers";

export default async function AdminDashboard() {
    const queryClient = new QueryClient();
    
    // try {
    //     await queryClient.prefetchQuery(fetchMembersFull());
    //     await queryClient.prefetchQuery(fetchRoles());
    // } catch (error) {
    //     console.error('Error prefetching queries:', error);
    // }
    
    return (<HydrationBoundary state={dehydrate(queryClient)}>
        <AdminDashboarClient />
    </HydrationBoundary>);
}