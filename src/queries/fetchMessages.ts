import { MessageDO } from "@/lib/types/data-objects";
import fetcher from "@/utils/fetcher";

export const fetchMessages = async (userId: string, method = 'unread') => {
    return fetcher<MessageDO[]>(`/api/messages?user_id=${userId}&method=${method}`);
  };
  