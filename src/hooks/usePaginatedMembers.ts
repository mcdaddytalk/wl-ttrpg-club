import { searchParamsCache } from "@/app/admin/_lib/validations";
//import { MemberDO } from "@/lib/types/custom";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation"



export const usePaginatedMembers = () => {
    const searchParams = useSearchParams();
    const params = searchParamsCache.parse(Object.fromEntries(searchParams.entries()));

    return useQuery({    
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
                const pageCount = Math.ceil(count / params.perPage);
                return { members, pageCount };
            }

    })
}