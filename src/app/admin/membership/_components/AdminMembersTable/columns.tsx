"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MemberDO } from "@/lib/types/data-objects"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { Eye, KeyIcon } from "lucide-react"
import { ConsentCell } from "@/app/admin/_components/ConsentCell"


interface ColumnOptions {
    onOpenModal: (modalName: string, data: MemberDO) => void
    router: ReturnType<typeof useRouter>;
}

export const getColumns = ({ onOpenModal, router }: ColumnOptions): ColumnDef<MemberDO>[] => [
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
            return isAdmin ? (
                <span className="inline-flex items-center px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
                  Admin
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-1 text-xs text-gray-500 bg-gray-200 rounded-full">
                  Member
                </span>
              );
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: "isMinor",
        header: "Is Minor?",
        cell: ({ row }) => {
            const isMinor = row.original.isMinor;
            return isMinor ? (
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
                  Minor
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-1 text-xs text-gray-500 bg-gray-200 rounded-full">
                  Adult
                </span>
              );
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        id: "consent",
        header: "Consent",
        cell: ({ row }) => (
          <ConsentCell member={row.original} />
        ),
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
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              role.name === "admin"
                                ? "bg-red-500 text-white"
                                : role.name === "gamemaster"
                                ? "bg-indigo-500 text-white"
                                : "bg-blue-500 text-white"
                            }`}
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
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          const color = {
            active: "bg-green-500",
            inactive: "bg-gray-400",
            pending: "bg-yellow-500",
            banned: "bg-red-500",
            soft_deleted: "bg-gray-400",
          }[status];
      
          return (
            <span className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${color}`}>
              {status}
            </span>
          );
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: "last_login_at",
        header: "Last Login",
        cell: ({ row }) => {
          const date = row.original.last_login_at;
          if (!date) return <span className="text-gray-400 text-xs italic">Never</span>;
          const formatted = new Intl.DateTimeFormat("en-US", {
            month: "short", day: "numeric", year: "numeric"
          }).format(new Date(date));
          return <span className="text-sm">{formatted}</span>;
        },
        enableSorting: true,
        enableHiding: true
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
                        <DropdownMenuItem onClick={() => router.push(`/admin/membership/${member.id}`)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onOpenModal('resetPassword', member)}>
                            <KeyIcon className="w-4 h-4 mr-2" /> Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onOpenModal('changeEmail', member)}>
                            <KeyIcon className="w-4 h-4 mr-2" /> Change Auth Email
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onOpenModal('manageRoles', member)}>
                            <Button
                                variant="outline"
                                size="sm"
                                aria-label="Edit member roles"            
                            >
                                Edit Roles
                            </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onOpenModal('removeMember', member)}>
                            <Button
                                variant="outline"
                                size="sm"
                                aria-label="Remove member"          
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