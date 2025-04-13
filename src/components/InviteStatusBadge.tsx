"use client";

import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface InviteStatusBadgeProps {
  viewedAt?: string | null;
  accepted?: boolean;
}

export function InviteStatusBadge({ viewedAt, accepted }: InviteStatusBadgeProps) {
  const viewedDate = viewedAt ? new Date(viewedAt).toLocaleDateString() : null;

  return (
    <div className="flex flex-col gap-1">
      {/* Viewed Status */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={viewedAt ? "text-blue-600 border-blue-400" : "text-gray-500 border-gray-300"}
          >
            {viewedDate ? `Viewed: ${viewedDate}` : "Not Viewed"}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          {viewedDate
            ? `Invite was viewed on ${viewedDate}`
            : "Invite has not yet been viewed"}
        </TooltipContent>
      </Tooltip>

      {/* Accepted Status */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={accepted ? "text-green-600 border-green-400" : "text-gray-500 border-gray-300"}
          >
            {accepted ? "Accepted" : "Not Accepted"}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          {accepted ? "Invite has been accepted" : "Invite not yet accepted"}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
