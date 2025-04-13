"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AuditTrailDO } from "@/lib/types/custom";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface ColumnOptions {
  onPreview: (data: AuditTrailDO) => void;
}
export function getColumns({ onPreview }: ColumnOptions): ColumnDef<AuditTrailDO>[] {
  return [
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.original.action}
        </Badge>
      ),
    },
    {
      accessorKey: "target_type",
      header: "Target",
    },
    {
      accessorKey: "summary",
      header: "Summary",
      cell: ({ row }) => {
        const { summary } = row.original;
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="truncate max-w-[200px]">{summary}</span>
            </TooltipTrigger>
            <TooltipContent>{summary}</TooltipContent>
          </Tooltip>
        );
      },
    },
    {
      accessorKey: "actor",
      header: "Actor",
      cell: ({ row }) => {
        const actor = row.original.actor;
        const name =
          actor?.profiles?.given_name || actor?.profiles?.surname
            ? `${actor?.profiles?.given_name ?? ""} ${actor?.profiles?.surname ?? ""}`.trim()
            : actor?.email ?? "System";
        return <span>{name}</span>;
      },
    },
    {
      accessorKey: "created_at",
      header: "Time",
      cell: ({ row }) => {
        return (
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(row.original.created_at), { addSuffix: true })}
          </span>
        );
      },
    },
    {
      id: "metadata",
      header: "Metadata",
      cell: ({ row }) => {
        const metadata = row.original.metadata;

        if (!metadata) return <span className="text-muted-foreground text-xs">—</span>;

        return (
          <span className="text-xs text-muted-foreground" onClick={() => onPreview(row.original)}>View Metadata</span>
        );
      },
    },
  ];
}
