import { DOW, GameInterval, GameSchedStatus } from "@/lib/types/custom";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "./useQueryClient";
import logger from '@/utils/logger';
import fetcher from "@/utils/fetcher";

export const useUpdateGame = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            title,
            description,
            system,
            maxSeats,
            status,
            location_id,
            nextGameDate,
            interval,
            dayOfWeek,
            gm_id
        }: {
            id: string;
            title?: string;
            description?: string;
            system?: string;
            maxSeats?: number;
            status?: GameSchedStatus;
            location_id?: string;
            nextGameDate?: string | null;
            interval?: GameInterval;
            dayOfWeek?: DOW;
            gm_id: string
        }) => {
            return fetcher(`/api/gamemaster/games/${id}`,                 
        {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id,
                    title,
                    description,
                    system,
                    maxSeats,
                    status,
                    location_id,
                    nextGameDate,
                    interval,
                    dayOfWeek,
                    gm_id
                }),
            });
        },
        onSuccess: (_data, { id }) => {
                queryClient.invalidateQueries({ queryKey: ["gamemaster", "game", id] });
        },
        onError: (error) => {
            logger.error(error);
        }
    });
};