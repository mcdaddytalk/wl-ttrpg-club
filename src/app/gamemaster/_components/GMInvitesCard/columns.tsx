"use client"

import { ColumnDef } from "@tanstack/react-table"
import { InviteData } from "@/lib/types/custom"
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


interface ColumnOptions {
    onOpenModal: (modalName: string, data: InviteData) => void
}

export const getColumns = ({ onOpenModal }: ColumnOptions): ColumnDef<InviteData>[] => [
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
            const game: { title: string } =  row.getValue("games")
            return (<span className="text-sm font-medium ">{game.title}</span>)
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
        accessorKey: "external_email",
        header: "Email (external)",
        cell: ({ row }) => {
            return (<span className="text-sm font-medium ">{row.original.external_email}</span>)
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: "external_phone",
        header: "Phone (external)",
        cell: ({ row }) => {
            return (<span className="text-sm font-medium ">{row.original.external_phone}</span>)
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
            const today = new Date();
            
            const { expires_at, accepted: isAccepted } = row.original;
            const date = new Date(expires_at);
            const diffInDays = Math.floor((date.getMilliseconds() - today.getMilliseconds()) / (1000 * 60 * 60 * 24));
            let colorClass = "text-blue-500"; // Default blue for > 3 days out
            let expiredText = date.toLocaleDateString();
            if (isAccepted) {
                colorClass = "text-green-500"; // Green if accepted
                expiredText = "Accepted";
            } else if (diffInDays <= 0) {
                colorClass = "text-red-500"; // Red if expired
            } else if (diffInDays === 1) {
                colorClass = "text-orange-500"; // Orange if 1 day out
            } else if (diffInDays <= 3) {
                colorClass = "text-yellow-500"; // Yellow for 3 or fewer days
            }
            const spanClass = `text-sm font-medium ${colorClass}`
            
            return <span className={spanClass}>{expiredText}</span>;
        },
        enableSorting: true,
        enableHiding: false
    }, // expires at
    {
        accessorKey: "accepted",
        header: "Accepted",
        cell: ({ row }) => {
            const isAccepted = row.getValue("accepted")
            return (
                <div
                    className={`inline-flex items-center justify-center w-8 h-8 rounded border ${
                        isAccepted
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