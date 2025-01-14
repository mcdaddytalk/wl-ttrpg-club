import Link from "next/link";
import { TbWorldPin, TbWorldWww } from "react-icons/tb";
import { Location } from "@/lib/types/custom";

interface GameLocationProps {
    location: Location;
}

const GameLocation = ({ location }: GameLocationProps): React.ReactElement => {
    if (!location) return (
        <></>
    );

    switch(location.type) {
        case 'vtt':
        case 'discord':
            return (
                <div className="flex items-center gap-2">
                    <TbWorldWww className="text-xl" />
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
                    
                </div>
            )
        case 'physical':
            return (
                <div className="flex items-center gap-2">
                    <TbWorldPin className="text-xl" />
                    <span>{""}
                        {location.name}
                        <br />
                        <Link href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address || '')}`} target="_blank">
                            {location.address}
                        </Link>
                    </span>
                </div>
            )
        default:
            return (
                <></>
            )
        }
    }

    export default GameLocation;