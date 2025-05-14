import { Audience } from "@/lib/types/custom";
import { AnnouncementDO } from "@/lib/types/data-objects";

import fetcher from "@/utils/fetcher";
import { getURL, toSearchParams } from "@/utils/helpers";
import logger from "@/utils/logger";


export type AnnouncementQueryParams = {
    title?: string;
    audience?: Audience;
    published?: boolean;
    pinned?: boolean;
    page?: number;
    limit?: number;
};

type AnnouncementListResponse = {
    data: AnnouncementDO[];
    total: number;
};

export async function fetchAnnouncements(
  params: AnnouncementQueryParams = {}
): Promise<AnnouncementListResponse> {
  const url = new URL(getURL('/api/announcements'), "https://wl-ttrpg.kaje.org");
  // Convert all defined params to query params
  const searchParams = toSearchParams(params);
  
  logger.debug('[FetchAnnouncement] Fetching announcements', url.toString(), searchParams.toString())
  return fetcher(url.toString(), undefined, searchParams) 
}