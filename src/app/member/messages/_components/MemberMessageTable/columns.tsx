"use client"

import { ColumnDef } from "@tanstack/react-table";
import { MessageDO } from "@/lib/types/data-objects";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Archive, MailOpen, Mail, Reply, Forward  } from "lucide-react";
import { DateCell, LinkCell, TextUppercaseCell } from "@/components/DataTable/data-table-cell-helpers";
import { Checkbox } from "@/components/ui/checkbox";

interface ColumnDefOptions {
    onArchive: (message: MessageDO) => void;
    onMarkRead: (message: MessageDO) => void;
    onReply: (message: MessageDO) => void;
    onForward: (message: MessageDO) => void;
}

export const getColumns = ({
    onArchive,
    onMarkRead,
    onReply,
    onForward
}: ColumnDefOptions): ColumnDef<MessageDO>[] => [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")}
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
        size: 20,
    },
    {
        accessorKey: "is_read",
        header: "Read",
        cell: ({ row }) => {
            const message = row.original;
            return (
                <Button variant="secondary" size="sm" onClick={() => onMarkRead(message)}>
                    { message.is_read ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4" /> }
                </Button>
            );
        },
        enableSorting: true,
        enableHiding: false,
        size: 40,
    },
    {
        accessorKey: "sender_id",
        header: "From",
        cell: ({ row }) => {
            const message = row.original;
            return (
                <div className="flex items-center gap-x-2">
                    <p>{message.sender.given_name} {message.sender.surname}</p>
                </div>
            );
        }
    },
    {
        accessorKey: "created_at",
        header: "Received At",
        cell: ({ row }) => {
            const { created_at} = row.original;
            return (
                <DateCell
                    date={created_at}
                    label="Received At"
                />
            );
        }
    },
    { 
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => {
            const { category } = row.original;
            return (
                <TextUppercaseCell
                    value={category}
                />
            );
        }
    },  
    {
        accessorKey: "subject",
        header: "Subject",
    },
    {
        accessorKey: "content",
        header: "Message",
    },
    {
        accessorKey: "link_url",
        header: "Associated Link",
        cell: ({ row }) => {
            const { link_url } = row.original;
            if (!link_url) {
                return null;
            }
            if (link_url.startsWith("http")) {
                return (
                    <LinkCell
                        href={link_url}
                        external={true}
                    />
                );
            }
            return (
                <LinkCell
                    href={link_url}
                />
            );
        }
    },
    {
        accessorKey: "id",
        header: "Actions",
        cell: ({ row }) => {
            const message = row.original;
            return (
                <div className="flex items-center gap-x-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                
                            </TooltipTrigger>
                            <TooltipContent>
                                { message.is_read ? "Mark as unread" : "Mark as read" }
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="secondary" size="sm" onClick={() => onReply(message)}>
                                    <Reply className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Reply
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="secondary" size="sm" onClick={() => onForward(message)}>
                                    <Forward className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Forward
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="destructive" size="sm" onClick={() => onArchive(message)}>
                                    <Archive className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>    
                            <TooltipContent>
                                Archive
                            </TooltipContent>
                        </Tooltip>
                    </div>
            );
        },
    },
];

