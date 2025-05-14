"use client"

import { ColumnDef } from "@tanstack/react-table"
import { InviteDO } from "@/lib/types/data-objects"
import { 
    DropdownMenu, 
    DropdownMenuContent,
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { InviteStatusBadge } from "@/components/InviteStatusBadge"

type ActiveModal = 'addNew' | 'purge' | 'edit' | 'delete' | null;
interface ColumnOptions {
    onOpenModal: (modalName: ActiveModal, data: InviteDO) => void
}

export const getColumns = ({ onOpenModal }: ColumnOptions): ColumnDef<InviteDO>[] => [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
            checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              aria-label="Select all"
              className="translate-y-0.5"
            />
          ),
          cell: ({ row }) => (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
              className="translate-y-0.5"
            />
          ),
          enableSorting: false,
          enableHiding: false,
          size: 80,
      },
      {
        accessorKey: "games",
        header: "Game",
        cell: ({ row }) => {
            const game = row.getValue("games") as { title?: string };
            return <span className="text-sm font-medium ">{game?.title ?? "Unknown Game"}</span>;
        },
        enableSorting: true,
        enableHiding: false
      },
    {
        accessorKey: "display_name",
        header: "Name",
        cell: ({ row }) => {
            return (<span className="text-sm font-medium ">{row.original.display_name}</span>)
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => {
            return (<span className="text-sm font-medium ">{row.original.email}</span>)
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => {
            return (<span className="text-sm font-medium ">{row.original.phone}</span>)
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: "invited_at",
        header: "Invited On",
        cell: ({ row }) => {
            const date = new Date(row.getValue("invited_at"));
            return date.toLocaleDateString();
        },
        enableSorting: true,
        enableHiding: false
    }, // invited at
    {
        accessorKey: "expires_at",
        header: "Expires At",
        cell: ({ row }) => {
            const { expires_at, accepted: isAccepted } = row.original;
            const today = new Date();
            let date: Date | undefined = undefined;

            let displayText = "N/A";
            let badgeColor = "slate";

            if (isAccepted) {
                displayText = "Accepted";
                badgeColor = "green";
            } else if (expires_at) {
                date = new Date(expires_at);
                if (!isNaN(date.getTime())) {
                    const diffInDays = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                    if (diffInDays < 0) {
                        displayText = "Expired";
                        badgeColor = "red";
                    } else if (diffInDays === 0) {
                        displayText = "Expires Today";
                        badgeColor = "orange";
                    } else if (diffInDays === 1) {
                        displayText = "1 Day Left";
                        badgeColor = "yellow";
                    } else if (diffInDays <= 3) {
                        displayText = `${diffInDays} Days Left`;
                        badgeColor = "blue";
                    } else {
                        displayText = date.toLocaleDateString();
                    }
                }
            }
            
            return (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Badge variant="outline" className={`text-${badgeColor}-600 border-${badgeColor}-400`}>{displayText}</Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Expires: {date ? date.toLocaleDateString() : "N/A"}</p>
                    </TooltipContent>
                </Tooltip>
            )
        },
        enableSorting: true,
        enableHiding: false
    }, // expires at
    {
        id: "invite_status",
        header: "Status",
        cell: ({ row }) => {
          const isAccepted = row.original.accepted;
          const viewedAt = row.original.viewed_at ?? null;
      
          return (
            <InviteStatusBadge accepted={isAccepted} viewedAt={viewedAt} />
          );
        },
        enableSorting: false,
        enableHiding: false,
    }, // accepted
    {
        accessorKey: "notified",
        header: "Notified",
        cell: ({ row }) => {
            const isNotified = row.getValue("notified")
            return (
                <div
                    className={`inline-flex items-center justify-center w-8 h-8 rounded border ${
                        isNotified
                        ? 'border-green-500 text-green-500'
                        : 'border-gray-400 text-gray-400'
                    }`}
                    >
                    <CheckCircle size={20} />
                </div>
            )
        },
        enableSorting: true,
        enableHiding: false
    }, // notified
    {
        id: 'actions', // A custom column for the button
        header: 'Actions',
        cell: ({ row }) => {
          const game = row.original; 
          return (
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
                                          
                    <DropdownMenuItem onClick={() => onOpenModal('edit', game)}>
                        <Button
                            variant="outline"
                            size="sm"
                        >
                            Edit
                        </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onOpenModal('delete', game)}>
                        <Button
                            variant="outline"
                            size="sm"
                        >
                            Delete
                        </Button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          );
        },
        enableSorting: false,
        enableHiding: false
      },
]