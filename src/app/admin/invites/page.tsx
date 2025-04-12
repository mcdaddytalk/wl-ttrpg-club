import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/server/getQueryClient";
import { AdminInvitationsTable } from "./_components/AdminInvitationsTable";



export default async function AdminNotesPage() {
  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminInvitationsTable />
    </HydrationBoundary>
  );
}
