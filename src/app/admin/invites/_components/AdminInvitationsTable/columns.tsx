"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InviteDO } from "@/lib/types/custom";

interface ColumnOptions {
  onOpenModal: (modal: string, invite: InviteDO) => void;
}

export const getColumns = ({ onOpenModal }: ColumnOptions): ColumnDef<InviteDO>[] => [
  {
    accessorKey: "display_name",
    header: "Invitee",
    cell: ({ row }) => {
      const invite = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-semibold">{invite.display_name}</span>
          {invite.email && (
            <span className="text-xs text-muted-foreground">{invite.email}</span>
          )}
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "game_title",
    header: "Game",
    cell: ({ row }) => row.original.game_title,
  },
  {
    accessorKey: "gm_name",
    header: "Gamemaster",
    cell: ({ row }) => row.original.gm_name,
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const { accepted, expires_at } = row.original;
      const now = new Date();
      const expired = !accepted && new Date(expires_at) < now;

      const status = accepted
        ? "Accepted"
        : expired
            ? "Expired"
            : "Pending";

      const variant = accepted
        ? "default"
        : expired
            ? "destructive"
            : "secondary";

      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    id: "notified",
    header: "Notified",
    cell: ({ row }) => (
      <Badge variant={row.original.notified ? "default" : "outline"}>
        {row.original.notified ? "Yes" : "No"}
      </Badge>
    ),
  },
  {
    accessorKey: "invited_at",
    header: "Invited At",
    cell: ({ row }) =>
      new Date(row.original.invited_at).toLocaleDateString(),
  },
  {
    accessorKey: "expires_at",
    header: "Expires",
    cell: ({ row }) =>
      new Date(row.original.expires_at).toLocaleDateString(),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const invite = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              ⋮
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onOpenModal("resend", invite)}>
              Resend Invite
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onOpenModal("cancel", invite)}>
              Cancel Invite
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];