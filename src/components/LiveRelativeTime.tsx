"use client";

import { useEffect, useState } from "react";
import { formatRelativeDate } from "@/utils/helpers";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import dayjs from "dayjs";

interface LiveRelativeTimeProps {
  value?: string | number | Date | null;
  referenceDate?: string | number | Date; // Optional "compare from" date
  refreshIntervalMs?: number;              // How often to refresh, default 60s
  tooltip?: boolean;                       // Show tooltip with exact ISO time
}

export function LiveRelativeTime({
  value,
  referenceDate,
  refreshIntervalMs = 60000, // 60 seconds default
  tooltip = true,
}: LiveRelativeTimeProps) {
  const [now, setNow] = useState(() => dayjs());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(dayjs());
    }, refreshIntervalMs);

    return () => clearInterval(interval);
  }, [refreshIntervalMs]);

  if (!value) {
    return <span className="text-muted-foreground">—</span>;
  }

  const from = referenceDate ? dayjs(referenceDate) : now; // ← use now here
  const relative = formatRelativeDate(value, from.toISOString()); // ← pass 'now'!

  const iso = dayjs(value).isValid() ? dayjs(value).toISOString() : undefined;

  const content = <span>{relative}</span>;

  if (!tooltip || !iso) {
    return content;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {content}
      </TooltipTrigger>
      <TooltipContent>
        {iso}
      </TooltipContent>
    </Tooltip>
  );
}
