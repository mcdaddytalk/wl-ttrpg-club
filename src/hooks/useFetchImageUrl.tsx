import { useMutation } from "@tanstack/react-query"

async function fetchImageUrl(imageStr: string, system?: string): Promise<string> {
    if (!imageStr || imageStr === "default") {
      //console.log('System:  ', system);
      switch (system) {
        case "DND5e":
          return "https://kthrpfzafznkkvalszoi.supabase.co/storage/v1/object/public/images/defaults/dnd5e_game.webp?t=2024-12-06T15%3A20%3A26.768Z"; // "/images/defaults/dnd5e_game.webp";
        case "Pathfinder":
          return "https://kthrpfzafznkkvalszoi.supabase.co/storage/v1/object/public/images/defaults/pf2e_game.webp?t=2024-12-06T15%3A20%3A47.730Z"; // "/images/defaults/pathfinder_game.webp";
        case "PF2e":
          return "https://kthrpfzafznkkvalszoi.supabase.co/storage/v1/object/public/images/defaults/pf2e_game.webp?t=2024-12-06T15%3A20%3A47.730Z"; // "/images/defaults/pf2e_game.webp";
        case "Savage Worlds":
          return "https://kthrpfzafznkkvalszoi.supabase.co/storage/v1/object/public/images/defaults/savage_worlds_game.webp?t=2024-12-06T15%3A21%3A14.153Z"; // "/images/defaults/savage_worlds_game.webp";
        default:
          return "https://kthrpfzafznkkvalszoi.supabase.co/storage/v1/object/public/images/defaults/default_game.webp?t=2024-12-06T15%3A18%3A54.208Z"; //"/images/defaults/default_game.webp";
      }
    }
  
    try {
        if (imageStr.startsWith("http")) return imageStr;
        const response = await fetch(`/api/image/${imageStr}`);
        return response.url;
    } catch (error) {
        console.error("Error fetching image:", error);
        return "/images/defaults/default_game.webp";
    }
}


export const useFetchImageUrl = () => {
    return useMutation({
        mutationFn: async ({ imageStr, system }: { imageStr: string, system?: string }) => {
            return await fetchImageUrl(imageStr, system);
        },
        onError: (error: Error) => {
            console.error('Error fetching image:', error);
        }
    })
}