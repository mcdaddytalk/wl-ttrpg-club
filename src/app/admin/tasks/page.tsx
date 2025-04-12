import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/server/getQueryClient";
import AdminTaskPageShell from "./AdminTaskShell";

export default async function AdminTasksPage() {
  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminTaskPageShell />
    </HydrationBoundary>
  );
}
