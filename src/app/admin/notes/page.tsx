import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/server/getQueryClient";
import AdminNotesDashboard from "./_components/AdminNotesDashboard";

export default async function AdminNotesPage() {
  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminNotesDashboard />
    </HydrationBoundary>
  );
}
