import { searchParamsCache } from "@/app/admin/_lib/adminInvites";
import { InviteDO } from "@/lib/types/custom";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

interface PaginatedInvitesResponse {
  invites: InviteDO[];
  pageCount: number;
}

export const usePaginatedInvites = () => {
  const searchParams = useSearchParams();
  const parsedParams = searchParamsCache.parse(Object.fromEntries(searchParams.entries()));

  return useQuery<PaginatedInvitesResponse>({
    queryKey: ["admin", "invites", parsedParams],
    queryFn: async () => {
      const res = await fetch("/api/admin/invites/params", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedParams),
      });

      if (!res.ok) throw new Error("Failed to fetch invites");
      const data = await res.json();
      return {
        invites: data.invites,
        pageCount: data.pageCount,
      };
    },
  });
};
