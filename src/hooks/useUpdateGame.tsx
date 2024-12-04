import { DOW, GameInterval, GameStatus } from "@/lib/types/custom";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "./useQueryClient";

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
            location,
            nextGameDate,
            interval,
            dayOfWeek,
            gm_id
        }: {
            id: string;
            title: string;
            description: string;
            system: string;
            maxSeats: number;
            status: GameStatus;
            location: string;
            nextGameDate: Date;
            interval: GameInterval;
            dayOfWeek: DOW;
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
                    location,
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
        onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["games", "user", "full"] });
        },
        onError: (error) => {
            console.error(error);
        }
    });
};