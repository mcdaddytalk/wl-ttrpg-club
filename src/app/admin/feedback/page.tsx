import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/server/getQueryClient";
import AdminFeedbackDashboard from "./_components/AdminFeedbackDashboard";
import { DataTableSkeleton } from "@/components/DataTable/data-table-skeleton";
import { Suspense } from "react";

export default async function AdminFeedbackPage() {
  const queryClient = getQueryClient(); // SSR-compatible query client
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={
                      <DataTableSkeleton 
                                          columnCount={5}
                                          rowCount={5}
                                          searchableColumnCount={2}
                                          filterableColumnCount={2}
                                          withPagination={false}
                                          cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
                                          shrinkZero
                                      />    
                  }>
        <AdminFeedbackDashboard />
      </Suspense>
    </HydrationBoundary>
  );
}