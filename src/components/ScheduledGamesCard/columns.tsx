"use client"

import { ColumnDef } from "@tanstack/react-table"
import { GMGameSchedule } from "@/lib/types/custom"
import { Button } from "../ui/button"

const handleShowDetails = (id: string) => {
    // Here, filter another table or perform any action using the `id`
    console.log('Show details for ID:', id);
    // Example: You could call a function to fetch or filter details
};

export const columns: ColumnDef<GMGameSchedule>[] = [
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
        accessorKey: "maxSeats",
        header: "Max Seats",
        cell: ({ row }) => {
            return row.getValue("maxSeats")
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
          const id = row.original.id; // Access the hidden `id` field
          return (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShowDetails(id)}
            >
              Show Details
            </Button>
          );
        },
      },
    
]