"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MemberData } from "@/lib/types/custom"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export const columns: ColumnDef<MemberData>[] = [
    {
        accessorKey: "displayName",
        header: "Name",
        cell: ({ row }) => {
            return (<span className="text-sm font-medium ">{row.original.profiles.given_name} {row.original.profiles.surname}</span>)
        }
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => {
            return (<span className="text-sm font-medium ">{row.original.email}</span>)
        }
    },
    {
        accessorKey: "is_admin",
        header: "Is Admin?",
        cell: ({ row }) => {
            const isAdmin = row.original.is_admin;
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
        }
    },
    {
        accessorKey: "is_minor",
        header: "Is Minor?",
        cell: ({ row }) => {
            const isMinor = row.original.is_minor;
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
        }
    },
    {
        accessorKey: "roles",
        header: "Roles",
        cell: ({ row }) => {
            const roles = row.original.member_roles;
            return (
                <div className="flex space-x-1 gap-1">
                    {roles
                        .sort((a, b) => a.roles.name.localeCompare(b.roles.name)) // Sort alphabetically by name
                        .map((role) => (
                        <span
                            key={role.roles.id}
                            className="px-2 py-1 text-sm font-medium text-white bg-blue-500 rounded-full"
                        >
                            {role.roles.name}
                        </span>
                    ))}
                </div>
            )
        }
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const member = row.original;
            const displayName = `${member.profiles.given_name} ${member.profiles.surname}`
            return (
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => member.onResetPassword?.(member.email)}
                    >
                        Reset Password
                    </Button>
                    { member.onManageRoles &&
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => member.onManageRoles?.(member)}
                        >
                            Edit Roles
                        </Button>
                    }
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => member.onRemoveMember?.(member.id, displayName)}
                    >
                        Remove
                    </Button>
                </div>
            )
        }
    },
]