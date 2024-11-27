"use client"

import { ColumnDef } from "@tanstack/react-table"
import { UpcomingGame } from "@/lib/types/custom"

export const columns: ColumnDef<UpcomingGame>[] = [
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "system",
        header: "System",
    },
    {
        accessorKey: "scheduled_for",
        header: "Game Date",
    },
]