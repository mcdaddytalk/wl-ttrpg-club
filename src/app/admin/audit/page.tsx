import { getQueryClient } from "@/server/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import AdminAuditTrailDashboard from "./_components/AdminAuditTrailDashboard";
import { Suspense } from "react";

export default async function AuditTrailPage() {
    const queryClient = getQueryClient();
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={
                    <div className="w-full h-[300px] flex items-center justify-center">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                }
            >
                <AdminAuditTrailDashboard />
            </Suspense>
        </HydrationBoundary>
    );
}
