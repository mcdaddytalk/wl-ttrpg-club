"use client"

import { ColumnDef } from "@tanstack/react-table"
import { RegisteredCharacter } from "@/lib/types/custom"

export const columns: ColumnDef<RegisteredCharacter>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "level",
        header: "Level",
    },
    {
        accessorKey: "experience",
        header: "Experience",
    },
    {
        accessorKey: "class",
        header: "Class",
    },
    {
        accessorKey: "race",
        header: "Race",
    },
    {
        accessorKey: "alignment",
        header: "Alignment",
    },
    {
        accessorKey: "background",
        header: "Background",
    }    
]

