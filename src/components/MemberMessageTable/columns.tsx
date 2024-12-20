"use client"

import { ColumnDef } from "@tanstack/react-table";
import { MessageDO } from "@/lib/types/custom";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Archive, MailOpen, Mail, Reply, Forward  } from "lucide-react";

export const columns: ColumnDef<MessageDO>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <input
                type="checkbox"
                checked={table.getIsAllPageRowsSelected()}
                onChange={table.getToggleAllRowsSelectedHandler()}
                className="cursor-pointer"
            />
        ),
        cell: ({ row }) => (
            <input
                type="checkbox"
                checked={row.getIsSelected()}
                onChange={row.getToggleSelectedHandler()}
                className="cursor-pointer"
            />
        ),
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
        header: "Time",
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
        accessorKey: "id",
        header: "Actions",
        cell: ({ row }) => {
            const message = row.original;
            return (
                <div className="flex items-center gap-x-2">
                        <Tooltip>
                            <TooltipTrigger>
                                <Button variant="secondary" size="sm" onClick={() => message.onMarkRead?.(message.id)}>
                                    { message.is_read ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4" /> }
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                { message.is_read ? "Mark as unread" : "Mark as read" }
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger>
                                <Button variant="secondary" size="sm" onClick={() => message.onReply?.(message)}>
                                    <Reply className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Reply
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger>
                                <Button variant="secondary" size="sm" onClick={() => message.onForward?.(message)}>
                                    <Forward className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Forward
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger>
                                <Button variant="destructive" size="sm" onClick={() => message.onArchive?.(message.id)}>
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

