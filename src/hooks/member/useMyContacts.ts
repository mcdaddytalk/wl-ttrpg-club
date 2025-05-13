import { ContactListDO } from "@/lib/types/data-objects";
import fetcher from "@/utils/fetcher";
import { useQuery } from "@tanstack/react-query";


export const useMyContacts = () => {
    return useQuery<ContactListDO[]>({
        queryKey: ['member', 'contacts'],
        queryFn: async () => await fetcher(`/api/members/contacts`)
    })
};