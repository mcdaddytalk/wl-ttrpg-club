import { getQueryClient } from "@/server/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import AdminGameResourcesDashboard from "./_components/AdminGameResourcesDashboard";

export default async function AdminResourcesPage() {
    const queryClient = getQueryClient();
  
    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <AdminGameResourcesDashboard />
      </HydrationBoundary>
    );
  }