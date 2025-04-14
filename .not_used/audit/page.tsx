import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/server/getQueryClient";
import AdminAuditTrailDashboard from "./_components/AdminAuditTrailDashboard";

export default async function AuditTrailPage() {
    const queryClient = getQueryClient();
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
          <AdminAuditTrailDashboard />
        </HydrationBoundary>
    );
}
