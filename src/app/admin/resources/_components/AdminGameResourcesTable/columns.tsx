"use client";

import { GameResourceDO } from "@/lib/types/data-objects";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DateCell } from "@/components/DataTable/data-table-cell-helpers";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";

interface ColumnOptions {
    onEdit: (resource: GameResourceDO) => void;
    onDelete: (resource: GameResourceDO) => void;
    onPreview: (resource: GameResourceDO) => void;
}

export const getColumns = ({ onEdit, onDelete, onPreview }: ColumnOptions): ColumnDef<GameResourceDO>[] => [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <span className="font-medium">{row.original.title}</span>,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <Badge>{row.original.category}</Badge>,
  },
  {
    accessorKey: "visibility",
    header: "Visibility",
    cell: ({ row }) => <span className="capitalize">{row.original.visibility}</span>,
  },
  {
    accessorKey: "pinned",
    header: "Pinned",
    cell: ({ row }) =>
      row.original.pinned ? <Badge variant="outline">Pinned</Badge> : null,
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => <DateCell date={row.original.created_at} />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const resource = row.original;
      return (
        <>
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
                    <DropdownMenuItem>
                        <Button asChild size="sm" variant="outline" onClick={() => onEdit(resource)}>
                            Edit
                        </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Button asChild size="sm" variant="outline" onClick={() => onDelete(resource)}>
                            Delete
                        </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onPreview(resource)}>
                      <Button variant="outline" size="sm">
                        Preview
                      </Button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
        
      );
    },
  },
];
