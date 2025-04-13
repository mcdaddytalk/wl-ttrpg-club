//import { fetchMembersFull } from "@/queries/fetchMembers";
import AdminMembersDashboardClient from "./AdminMembersDashboardClient";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

export default async function AdminMembersDashboard() {
    const queryClient = new QueryClient();

    //await queryClient.prefetchQuery({ queryKey: ["admin", "members"], queryFn: fetchMembersFull });
        
    return (<HydrationBoundary state={dehydrate(queryClient)}>
        <AdminMembersDashboardClient />
    </HydrationBoundary>);
}