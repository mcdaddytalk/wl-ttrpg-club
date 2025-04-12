import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import AdminMemberDetail from "../_components/AdminMemberDetail";

import { getMemberByIdQueryOptions } from "@/queries/admin";
import { getQueryClient } from "@/server/getQueryClient";

interface MemberParams {
  id: string;
}

export default async function MemberDetailPage({ params }: { params: Promise<MemberParams> }) {
  const { id } = await params;
  const queryClient = getQueryClient();
  const queryOptions = getMemberByIdQueryOptions(id);

  await queryClient.prefetchQuery(queryOptions);
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      {/* AdminMemberDetail should use the same query inside a useQuery */}
      <AdminMemberDetail memberId={id} />
    </HydrationBoundary>
  );
}
