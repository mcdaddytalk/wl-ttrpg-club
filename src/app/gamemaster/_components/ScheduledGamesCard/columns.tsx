"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Location } from "@/lib/types/custom"
import { GMGameDO } from "@/lib/types/data-objects"
import { Button } from "@/components/ui/button"
import { 
    DropdownMenu, 
    DropdownMenuContent,
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { DateCell, TextUppercaseCell } from "@/components/DataTable/data-table-cell-helpers"

interface ColumnOptions {
    onOpenModal: (modalName: string, data: GMGameDO) => void
}

export const getColumns = ({ onOpenModal }: ColumnOptions): ColumnDef<GMGameDO>[] => [
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => {
            return row.getValue("title")
        },
        enableSorting: true,
        enableHiding: false,
        size: 600
    },
    {
        accessorKey: "system",
        header: "System",
        cell: ({ row }) => {
            return row.getValue("system")
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: "interval",
        header: "Interval",
        cell: ({ row }) => {
            const interval = row.getValue("interval") as string || 'Unknown';
            return TextUppercaseCell({ value: interval })
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: "dow",
        header: "Day of Week",
        cell: ({ row }) => {
            const dow = row.getValue("dow") as string || 'Unknown';
            return TextUppercaseCell({ value: dow })
        },
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: "scheduled_next",
        header: "Next Session",
        cell: ({ row }) => {
            return DateCell({ date: row.getValue("scheduled_next") })
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: "location",
        header: "Location",    
        cell: ({ row }) => {
            const location: Location = row.getValue("location");
            return location?.name;
        },
        enableResizing: true,
        enableSorting: true,
        enableHiding: true,
        size: 400      
    },
    {
        accessorKey: "invites",
        header: "Invites Pending",
        cell: ({ row }) => {
            return row.getValue("invites")
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: "pending",
        header: "Approvals Pending",
        cell: ({ row }) => {
            return row.getValue("pending")
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: "registered",
        header: "Registered Players",
        cell: ({ row }) => {
            return row.getValue("registered")
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: "startingSeats",
        header: "Min Seats",
        cell: ({ row }) => {
            return row.getValue("startingSeats")
        },
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: "maxSeats",
        header: "Max Seats",
        cell: ({ row }) => {
            return row.getValue("maxSeats")
        },
        enableSorting: true,
        enableHiding: true
    },    
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            return row.getValue("status")
        },
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: "visibility",
        header: "Visibility",
        cell: ({ row }) => {
            return row.getValue("visibility")
        },
        enableSorting: true,
        enableHiding: true
    },
    {
        id: 'actions', // A custom column for the button
        header: 'Actions',
        cell: ({ row }) => {
          const game = row.original; 
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
                    <DropdownMenuItem disabled={game.visibility === 'public'} onClick={() => onOpenModal('invites', game)}>
                        <Button
                            variant="outline"
                            size="sm"
                        >
                            Add Invites
                        </Button>
                    </DropdownMenuItem>                        
                    <DropdownMenuItem onClick={() => onOpenModal('edit', game)}>
                        <Button
                            variant="outline"
                            size="sm"
                        >
                            Edit
                        </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onOpenModal('time', game)}>
                        <Button
                            variant="outline"
                            size="sm"
                        >
                            Game Date
                        </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onOpenModal('transfer', game)}>
                        <Button
                            variant="outline"
                            size="sm"
                        >
                            Transfer
                        </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => game.onShowDetails?.(game)}>
                        <Button
                            variant="outline"
                            size="sm"                                    
                        >
                            View
                        </Button>
                    </DropdownMenuItem>                    
                </DropdownMenuContent>
            </DropdownMenu>
          );
        },
        enableSorting: false,
        enableHiding: false
      },
    
]