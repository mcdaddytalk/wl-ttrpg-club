"use client";

import { AdminNoteDO } from "@/lib/types/data-objects";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export const getColumns = (): ColumnDef<AdminNoteDO>[] => [
  {
    accessorKey: "author",
    header: "Author",
    cell: ({ row }) => {
      const author = row.original.author;
      if (!author) return <span className="italic text-muted">Deleted user</span>;
      const fullName = `${author.displayName}`.trim();
      return (
        <span className="font-medium">{fullName || author.email}</span>
      );
    },
  },
  {
    accessorKey: "author_email",
    header: "Author Email",
    cell: ({ row }) => {
        const authorEmail = row.original.author_email;
        if (!authorEmail) return <span className="italic text-muted">Deleted user</span>;
        return <span className="text-sm">{row.original.author_email}</span>;
    },
  },
  {
    accessorKey: "target_type",
    header: "Target",
    cell: ({ row }) => {
      const type = row.original.target_type;
      return <Badge variant="outline">{type}</Badge>;
    },
  },
  {
    accessorKey: "target_id",
    header: "Target ID",
    cell: ({ row }) => (
      <span className="text-xs font-mono text-muted-foreground">{row.original.target_id}</span>
    ),
  },
  {
    accessorKey: "note",
    header: "Note",
    cell: ({ row }) => {
      const note = row.original.note;
      const preview = note.length > 80 ? note.slice(0, 80) + "..." : note;
      return <span className="text-sm">{preview}</span>;
    },
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.original.created_at);
      return <span className="text-sm">{format(date, "yyyy-MM-dd HH:mm")}</span>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const note = row.original;
      return (
        <Button size="sm" variant="outline" onClick={() => note.onView?.(note)}>
          View
        </Button>
      );
    },
    enableSorting: false,
    enableHiding: false,
  }
];
