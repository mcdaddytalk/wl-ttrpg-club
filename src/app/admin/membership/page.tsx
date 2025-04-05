import AdminMembersDashboarClient from "./AdminMembersDashboardClient";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

export default async function AdminMembersDashboard() {
    const queryClient = new QueryClient();
        
    return (<HydrationBoundary state={dehydrate(queryClient)}>
        <AdminMembersDashboarClient />
    </HydrationBoundary>);
}