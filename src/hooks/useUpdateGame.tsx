import { DOW, GameInterval, GameSchedStatus } from "@/lib/types/custom";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "./useQueryClient";
import logger from '@/utils/logger';

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
            const response = await fetch(`/api/gamemaster/${gm_id}/games`,                 
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
                    dayOfWeek
                }),
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        },
        onSuccess: (_data, { gm_id }) => {
                queryClient.invalidateQueries({ queryKey: ["games", gm_id, "gm", "full"] });
        },
        onError: (error) => {
            logger.error(error);
        }
    });
};