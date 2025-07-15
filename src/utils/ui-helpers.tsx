import { Badge } from "@/components/ui/badge";
import { GameData } from "@/lib/types/custom";
import { LuUsers } from "react-icons/lu";
import { toSentenceCase } from "./helpers";

export const enhanceStatus = (game: GameData) => {
    const { status, currentSeats, startingSeats } = game;
    if (status === 'awaiting-players') {
        const seatsNeeded = startingSeats > 0 ? startingSeats - currentSeats : startingSeats;
        if (seatsNeeded <= 0) return 'Active';
        return (
            <Badge variant="default" className="bg-blue-300 text-slate-700 rounded-lg" >
                <LuUsers />
                <span>{seatsNeeded} NEEDED TO START</span>
            </Badge>        
        )
    }
    return toSentenceCase(status);
}