"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MemberDO } from "@/lib/types/custom"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

interface ColumnOptions {
    onOpenModal: (modalName: string, data: MemberDO) => void
}

export const getColumns = ({ onOpenModal }: ColumnOptions): ColumnDef<MemberDO>[] => [
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
    },
    {
        accessorKey: "displayName",
        header: "Name",
        cell: ({ row }) => {
            return (<span className="text-sm font-medium ">{row.original.displayName}</span>)
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
        accessorKey: "isAdmin",
        header: "Is Admin?",
        cell: ({ row }) => {
            const isAdmin = row.original.isAdmin;
            return (
                <div
                    className={`inline-flex items-center justify-center w-8 h-8 rounded border ${
                        isAdmin
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
    },
    {
        accessorKey: "isMinor",
        header: "Is Minor?",
        cell: ({ row }) => {
            const isMinor = row.original.isMinor;
            return (
                <div
                    className={`inline-flex items-center justify-center w-8 h-8 rounded border ${
                        isMinor
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
    },
    {
        accessorKey: "roles",
        header: "Roles",
        cell: ({ row }) => {
            const roles = row.original.roles;
            return (
                <div className="flex space-x-1 gap-1">
                    {roles
                        .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically by name
                        .map((role) => (
                        <span
                            key={role.id}
                            className="px-2 py-1 text-sm font-medium text-white bg-blue-500 rounded-full"
                        >
                            {role.name}
                        </span>
                    ))}
                </div>
            )
        },
        enableSorting: false,
        enableHiding: false
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const member = row.original;
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
                        <DropdownMenuItem onClick={() => onOpenModal('resetPassword', member)}>
                            <Button
                                variant="outline"
                                size="sm"
                            >
                                Reset Password
                            </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onOpenModal('manageRoles', member)}>
                            <Button
                                variant="outline"
                                size="sm"                                    
                            >
                                Edit Roles
                            </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onOpenModal('removeMember', member)}>
                            <Button
                                variant="outline"
                                size="sm"                                
                            >
                                Remove
                            </Button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
        enableSorting: false,
        enableHiding: false
    },
]