import { StarOff } from "lucide-react";


export function FavoriteBadge({ isFavorite }: { isFavorite: boolean }) {
    return isFavorite ? '🌟 Favorite' : (
      <div className="flex items-center gap-2">
        <StarOff size={12} />
        <span className="text-slate-300"> Favorite</span>
      </div>
    );
  }