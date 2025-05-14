'use client'

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import { GMGameScheduleDO } from "@/lib/types/data-objects"
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { BadgeCell, DateCell, LinkCell } from "@/components/DataTable/data-table-cell-helpers"
import { StatusBadge } from "@/components/StatusBadge"
import { LocationTypeBadge } from "@/components/LocationTypeBadge"
import { formatRecurrence, formatSessionTiming } from "@/utils/helpers"
import { DOW } from "@/lib/types/custom"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

type Props = {
    onOpenModal: (modalName: string, data: GMGameScheduleDO) => void
}

export const getColumns = ({
    onOpenModal
}: Props): ColumnDef<GMGameScheduleDO>[] => [
  {
    accessorKey: "game_title",
    header: "Game",
    cell: ({ row }) => {
      const game = row.original
      return (
        <LinkCell href={`/games/adventure/${game.game_id}`} label={game.game_title} />
      )
    },
  },
  {
    accessorKey: "next_game_date",
    header: "Next Session",
    cell: ({ row }) => (DateCell({ date: row.original.next_game_date, label: "Next Session" })),
  },
  {
    id: "next_session",
    header: "Next Session",
    cell: ({ row }) => {
        const { next_game_date } = row.original
        const { label, isOverdue, fullDate } = formatSessionTiming(next_game_date)
    
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className={isOverdue ? "text-red-600 font-semibold" : "text-muted-foreground"}>
                {label}
              </span>
            </TooltipTrigger>
            <TooltipContent>{fullDate ?? "No session date set"}</TooltipContent>
          </Tooltip>
        )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "interval",
    header: "Interval",
    cell: ({ row }) => (
        <BadgeCell
            value={row.original.interval}
            variant="outline"
            uppercase
        />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "recurrence",
    header: "Recurrence",
    cell: ({ row }) => {
      const sched = row.original
      return <span>{formatRecurrence(sched.interval, sched.day_of_week as DOW)}</span>
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "schedule_status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge status={row.original.schedule_status} />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
      const loc = row.original.location
      return loc ? (
            <div className="flex justify-between items-center w-full">
                <div className="flex flex-col">
                    <span className="truncate font-medium">{loc.name}</span>
                    {loc.scope === "disabled" && (
                        <span className="text-xs text-muted-foreground italic">Inactive</span>
                    )}
                </div>
                <LocationTypeBadge type={loc.type} />
            </div>
      ) : (
        <span className="text-muted-foreground text-sm">Unassigned</span>
      )
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
        const schedule = row.original;
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onOpenModal('editSchedule', schedule)}>
                        <Button size="sm" variant="ghost">
                            <Pencil className="w-4 h-4" /> Edit Schedule
                        </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onOpenModal('removeSchedule', schedule)}>
                        <Button
                            variant="ghost"
                            size="sm"                                
                        >
                            Remove Schedule
                        </Button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    },
    enableSorting: false,
    enableHiding: false
  }
]