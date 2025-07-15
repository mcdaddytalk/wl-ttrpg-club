import Link from "next/link";
import { TbQuestionMark, TbWorldPin, TbWorldWww } from "react-icons/tb";
import { Location } from "@/lib/types/custom";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface GameLocationProps {
    location: Location;
}

const GameLocation = ({ location }: GameLocationProps): React.ReactElement => {
    if (!location) return (
            <div className="flex items-center gap-2">
                <TbQuestionMark className="text-xl" />
                <span>Location TBD</span>
            </div>
        );

    switch(location.type) {
        case 'vtt':
        case 'discord':
            return (
                <div className="flex items-center gap-2">
                    <TbWorldWww className="text-xl" />
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span>
                                <Link 
                                    href={location.url || ''} 
                                    target="_blank"
                                    rel="noopener noreferrer" 
                                    className="underline"
                                >
                                    {location.name}
                                </Link>
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            {location.url}
                        </TooltipContent>
                    </Tooltip>                    
                </div>
            )
        case 'physical':
            return (
                <div className="flex items-center gap-2">
                    <TbWorldPin className="text-xl" />
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span>{""}
                                <Link href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address || '')}`} target="_blank">
                                    {location.name}
                                </Link>
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            {location.address}
                        </TooltipContent>
                    </Tooltip>
                </div>
            )
        default:
            return (
                <div className="flex items-center gap-2">
                    <TbQuestionMark className="text-xl" />
                    <span>Location TBD</span>
                </div>
            )
        }
    }

    export default GameLocation;