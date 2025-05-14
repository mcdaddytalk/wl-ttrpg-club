import { toSentenceCase } from "@/utils/helpers"
import clsx from "clsx"


export const LocationTypeBadge = ({ type }: { type: string }) => {
    return (
      <span
        className={clsx(
          "text-xs px-2 py-0.5 rounded-md",
          {
            "bg-blue-100 text-blue-800 border border-blue-300": type === "vtt",
            "bg-purple-100 text-purple-800 border border-purple-300": type === "discord",
            "bg-orange-100 text-orange-800 border border-orange-300": type === "physical",
            "bg-muted text-muted-foreground": !type || !["vtt", "discord", "physical"].includes(type),
          }
        )}
      >
        {toSentenceCase(type)}
      </span>
    )
}