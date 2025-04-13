"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { GMGameDataDO } from "@/lib/types/custom";

interface ColumnOptions {
  onOpenModal: (modalName: string, game: GMGameDataDO) => void;
}

export const getColumns = ({ onOpenModal }: ColumnOptions): ColumnDef<GMGameDataDO>[] => [
  {
    accessorKey: "title",
    header: "Game",
    cell: ({ row }) => {
      const game = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-semibold">{game.title}</span>
          <span className="text-xs text-muted-foreground">{game.system}</span>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const color = {
        scheduled: "bg-green-500",
        paused: "bg-yellow-500",
        completed: "bg-gray-400",
        canceled: "bg-red-500",
      }[status] || "bg-slate-500";

      return <Badge className={color}>{status}</Badge>;
    },
    enableSorting: true,
  },
  {
    accessorKey: "gm_name",
    header: "Gamemaster",
    cell: ({ row }) => {
      const gmName = row.original.gm_name || "—";
      return (
        <div className="flex justify-between items-center">
          <span>{gmName}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenModal("assignGM", row.original)}
          >
            Change
          </Button>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "player_count",
    header: "Players",
    cell: ({ row }) => row.original.player_count.toString(),
    enableSorting: true,
  },
  {
    accessorKey: "next_session_at",
    header: "Next Session",
    cell: ({ row }) => {
      const date = row.original.next_session_at;
      if (!date) return <span className="text-muted-foreground text-xs">—</span>;
      const formatted = new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
      }).format(new Date(date));
      return <span className="text-sm">{formatted}</span>;
    },
    enableSorting: true,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const game = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline">
              ⋮
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onOpenModal("assignGM", game)}>
              Assign GM
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onOpenModal("archive", game)}>
              {game.deleted_at ? "Unarchive" : "Archive"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onOpenModal("viewDetails", game)}>
              View Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
  },
];