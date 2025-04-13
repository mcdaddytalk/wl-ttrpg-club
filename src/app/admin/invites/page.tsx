import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/server/getQueryClient";
import { AdminInvitationsTable } from "./_components/AdminInvitationsTable";
import { DataTableSkeleton } from "@/components/DataTable/data-table-skeleton";
import { Suspense } from "react";



export default async function AdminNotesPage() {
  const queryClient = getQueryClient();
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
        <AdminInvitationsTable />
      </Suspense>
    </HydrationBoundary>
  );
}
