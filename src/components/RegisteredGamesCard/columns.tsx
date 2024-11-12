"use client"

import { ColumnDef } from "@tanstack/react-table"
import { RegisteredGame } from "@/lib/types/custom"

export const columns: ColumnDef<RegisteredGame>[] = [
    {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => {
            return row.getValue("id")
        }
    },
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
        accessorKey: "gm",
        header: "GM",
        cell: ({ row }) => {
            return row.getValue("gm")
        }
    },
    {
        accessorKey: "players",
        header: "Players",
        cell: ({ row }) => {
            return row.getValue("players")
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
        accessorKey: "scheduled_at",
        header: "Scheduled",
        cell: ({ row }) => {
            return row.getValue("scheduled_at")
        }
    },
    {
        accessorKey: "registered_at",
        header: "Registered",
        cell: ({ row }) => {
            return row.getValue("registered_at")
        }
    },
    {
        accessorKey: "created_at",
        header: "Created",
        cell: ({ row }) => {
            return row.getValue("created_at")
        }
    },
]