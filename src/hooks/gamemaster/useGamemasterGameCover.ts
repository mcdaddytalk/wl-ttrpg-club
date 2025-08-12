import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "../useQueryClient";
import fetcher from "@/utils/fetcher";



export const useUploadGameCover = (gameId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append("file", file);
            return fetcher<string>(`/api/gamemaster/games/${gameId}/cover`, {
                method: "POST",
                body: formData,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["gamemaster", "games", "full"] });
            queryClient.invalidateQueries({ queryKey: ["gamemaster", "game", gameId] });
        },
    });
};

export const useDeleteGameCover = (gameId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            return fetcher(`/api/gamemaster/games/${gameId}/cover`, { method: "DELETE" });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["gamemaster", "games", "full"] });
            queryClient.invalidateQueries({ queryKey: ["gamemaster", "game", gameId] });
        },
    });
};