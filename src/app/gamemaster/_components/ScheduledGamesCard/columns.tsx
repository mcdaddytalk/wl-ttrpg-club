"use client"

import { ColumnDef } from "@tanstack/react-table"
import { GMGameData } from "@/lib/types/custom"
import { Button } from "@/components/ui/button"
import { 
    DropdownMenu, 
    DropdownMenuContent,
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

const actions = [
    { 
        name: "Edit", 
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">`,
        onClick: (game: GMGameData) => game.onEditGame?.(game)
    },
    // { 
    //     name: "Delete", 
    //     icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">`,
    //     onClick: () => game.onDeleteGame?.(game)
    // },
    { 
        name: "View", 
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">`,
        onClick: (game: GMGameData) => game.onShowDetails?.(game)
    }
]


export const columns: ColumnDef<GMGameData>[] = [
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => {
            return row.getValue("title")
        }
    },
    {
        accessorKey: "system",
        header: "System",
        cell: ({ row }) => {
            return row.getValue("system")
        }
    },
    {
        accessorKey: "interval",
        header: "Interval",
        cell: ({ row }) => {
            return row.getValue("interval")
        }
    },
    {
        accessorKey: "dow",
        header: "Day of Week",
        cell: ({ row }) => {
            return (row.getValue("dow") as string).charAt(0).toUpperCase() + (row.getValue("dow") as string).slice(1)
        }
    },
    {
        accessorKey: "scheduled_next",
        header: "Next Session",
        cell: ({ row }) => {
            const data = row.getValue("scheduled_next") as Date;
            return new Date(data).toLocaleDateString()
        }
    },
    {
        accessorKey: "location",
        header: "Location",
        cell: ({ row }) => {
            return row.getValue("location")
        }
    },
    {
        accessorKey: "pending",
        header: "Approvals Pending",
        cell: ({ row }) => {
            return row.getValue("pending")
        }
    },
    {
        accessorKey: "registered",
        header: "Registered Players",
        cell: ({ row }) => {
            return row.getValue("registered")
        }
    },
    {
        accessorKey: "startingSeats",
        header: "Min Seats",
        cell: ({ row }) => {
            return row.getValue("startingSeats")
        }
    },
    {
        accessorKey: "maxSeats",
        header: "Max Seats",
        cell: ({ row }) => {
            return row.getValue("maxSeats")
        }
    },    
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            return row.getValue("status")
        }
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
                    {actions.map((action) => (
                        <DropdownMenuItem key={action.name} onClick={() => action.onClick(game)}>
                            <Button variant="secondary" size="sm" className="h-8 w-full p-0">
                                <span className="">{action.name}</span>
                            </Button>
                        </DropdownMenuItem>
                    ))}                    
                </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    
]