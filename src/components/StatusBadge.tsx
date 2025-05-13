import { statusBadge, toSentenceCase } from "@/utils/helpers"


export const StatusBadge = ({ status }: { status: string }) => {
    const className = statusBadge(status)

    return (
        <span className={`text-xs px-2 py-0.5 rounded-md ${className}`}>
          {toSentenceCase(status)}
        </span>
    )
}