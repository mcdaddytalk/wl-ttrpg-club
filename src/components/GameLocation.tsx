import Link from "next/link";
import { TbQuestionMark, TbWorldPin, TbWorldWww } from "react-icons/tb";
import { Location } from "@/lib/types/custom";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface GameLocationProps {
    location: Location;
    showFullLocation?: boolean
}

const GameLocation = ({ 
    location,
    showFullLocation = false
}: GameLocationProps): React.ReactElement => {
    if (!location) return (
        <div className="flex items-center gap-2">
            <TbQuestionMark className="text-xl" />
            <span>Location TBD</span>
        </div>
    );

    const isVirtual = location.type === 'vtt' || location.type === 'discord';
    if (!showFullLocation) {
    return (
      <div className="flex items-center gap-2">
        {isVirtual ? (
          <TbWorldWww className="text-xl" />
        ) : (
          <TbWorldPin className="text-xl" />
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="capitalize cursor-default">
              {isVirtual ? "Virtual" : "Physical"}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            Actual location will be provided once registration is approved.
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  switch (location.type) {
    case "vtt":
    case "discord":
      return (
        <div className="flex items-center gap-2">
          <TbWorldWww className="text-xl" />
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Link
                  href={location.url || ""}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {location.name}
                </Link>
              </span>
            </TooltipTrigger>
            <TooltipContent>{location.url}</TooltipContent>
          </Tooltip>
        </div>
      );
    case "physical":
      return (
        <div className="flex items-center gap-2">
          <TbWorldPin className="text-xl" />
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Link
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    location.address || ""
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {location.name}
                </Link>
              </span>
            </TooltipTrigger>
            <TooltipContent>{location.address}</TooltipContent>
          </Tooltip>
        </div>
      );
    default:
      return (
        <div className="flex items-center gap-2">
          <TbQuestionMark className="text-xl" />
          <span>Location TBD</span>
        </div>
      );
  }
};

export default GameLocation;