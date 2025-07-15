export function ScheduleStatusBadge({ status }: { status: string }) {
    const colorMap: Record<string, string> = {
      active: "bg-green-100 text-green-800 border border-green-300",
      paused: "bg-yellow-100 text-yellow-800 border border-yellow-300",
      completed: "bg-blue-100 text-blue-800 border border-blue-300",
      cancelled: "bg-red-100 text-red-800 border border-red-300",
    }
  
    const colorClass = colorMap[status.toLowerCase()] || "bg-muted text-muted-foreground"
  
    return (
      <span className={`text-xs px-2 py-1 rounded-full capitalize ${colorClass}`}>
        {status}
      </span>
    )
  }