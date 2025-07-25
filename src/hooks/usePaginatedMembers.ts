import { defaultMembersParams, searchParamsCache } from "@/app/admin/_lib/adminMembers";
import { MemberDO } from "@/lib/types/data-objects";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation"


interface UsePaginatedMembersResult {
    members: MemberDO[];
    pageCount: number;
}

export const usePaginatedMembers = () => {
    const searchParams = useSearchParams();
    const parsed = searchParamsCache.parse(Object.fromEntries(searchParams.entries()));
    const params = { ...defaultMembersParams, ...parsed };

    return useQuery<UsePaginatedMembersResult>({    
        queryKey: ['admin', 'members', 'full', params],
        queryFn: async () => {
                const response = await fetch("/api/admin/members/params",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(params),
                    }
                );
                if (!response.ok) throw new Error("Failed to fetch members");
                const data = await response.json();
                const { members, count } = data;
                const pageCount = Math.ceil(count / params.pageSize);
                return { members, pageCount };
            }

    })
}