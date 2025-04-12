import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/server/getQueryClient";
import { AdminGamesTable } from "./_components/AdminGamesTable";


export default async function AdminNotesPage() {
  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminGamesTable />
    </HydrationBoundary>
  );
}
