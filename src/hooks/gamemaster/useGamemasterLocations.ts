import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { GMLocationResponse } from "@/lib/types/custom";
import fetcher from "@/utils/fetcher";
import logger from "@/utils/logger";

type Options = {
    page?: number;
    pageSize?: number;
    onlyActive?: boolean;
};

export const useGamemasterLocations = (options: Options = {}) => {
    const query = useQuery<
            GMLocationResponse,
            Error
        >({
            queryKey: ["gamemaster", "locations", options],
            queryFn: async () => {
                const params = new URLSearchParams();

                if (options.page) params.set("page", options.page.toString());
                if (options.pageSize) params.set("pageSize", options.pageSize.toString());
                if (options.onlyActive) params.set("active", "true");

                return fetcher("/api/gamemaster/locations", undefined, params);
            },
            placeholderData: keepPreviousData,            
        });

  if (query.isError) {
    logger.error(query.error);
  }

  const { data, total, page } = query.data ?? { data: [], total: 0, page: 1 };

  return {
    locations: data,
    total,
    page,
    isLoading: query.isLoading,
    refetch: query.refetch,
    isError: query.isError,
    error: query.error,
  };
};
