"use client"

import { ColumnDef } from "@tanstack/react-table"
import { GMGameData } from "@/lib/types/custom"
import { Button } from "@/components/ui/button"


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
        accessorKey: "registered",
        header: "Registered",
        cell: ({ row }) => {
            return row.getValue("registered")
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
            <div className="flex space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => game.onEditGame?.(game)}
                >
                    Edit
                </Button>
                <Button
                variant="outline"
                size="sm"
                onClick={() => game.onShowDetails?.(game)}
                >
                Show Details
                </Button>
            </div>
          );
        },
      },
    
]