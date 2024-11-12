"use client"

import { ColumnDef } from "@tanstack/react-table"
import { UpcomingGame } from "@/lib/types/custom"

export const columns: ColumnDef<UpcomingGame>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "time",
        header: "Time",
    },
    {
        accessorKey: "date",
        header: "Date",
    },
]