import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/server/getQueryClient";
import AdminFeedbackDashboard from "./_components/AdminFeedbackDashboard";

export default async function AdminFeedbackPage() {
  const queryClient = getQueryClient(); // SSR-compatible query client
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminFeedbackDashboard />
    </HydrationBoundary>
  );
}