"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FeedbackDO } from "@/lib/types/custom";
import { BooleanCellWithTooltip, DateCell } from "@/components/DataTable/data-table-cell-helpers";
import { Button } from "@/components/ui/button";

interface ColumnOptions {
  onPreview: (feedback: FeedbackDO) => void;
}

export const getColumns = ({ onPreview }: ColumnOptions): ColumnDef<FeedbackDO>[] => [
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <span className="capitalize">{row.original.category}</span>
    ),
    enableSorting: true
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => (
      <span className="truncate max-w-md block">{row.original.message.slice(0, 80)}...</span>
    ),
    enableSorting: false
  },
  {
    accessorKey: "submitted_at",
    header: "Submitted At",
    cell: ({ row }) => (
      <DateCell date={row.original.submitted_at} label="Submitted At" />
    ),
    enableSorting: true
  },
  {
    accessorKey: "handled",
    header: "Handled",
    cell: ({ row }) => (
      <BooleanCellWithTooltip value={row.original.handled} label="Handled" />
    ),
    enableSorting: true
  },
  {
    accessorKey: "handled_at",
    header: "Handled At",
    cell: ({ row }) =>
      row.original.handled_at ? (
        <DateCell date={row.original.handled_at} label="Handled At" />
      ) : (
        <span className="text-muted-foreground text-xs">—</span>
      ),
    enableSorting: true
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const feedback = row.original;
      return (
        <Button size="sm" onClick={() => onPreview(feedback)}>
          View
        </Button>
      );
    },
    enableSorting: false
  }
];
