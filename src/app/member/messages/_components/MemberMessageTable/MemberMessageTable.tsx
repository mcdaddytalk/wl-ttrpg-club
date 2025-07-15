"use client"

import { MessageDO } from "@/lib/types/data-objects";
import { User } from "@supabase/supabase-js";
import React, { useCallback, useMemo, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArchiveRestore, MailCheck, SendHorizonal } from "lucide-react";
import MessageModal from "@/components/modals/MessageModal";
import logger from "@/utils/logger";
import { useMyContacts } from "@/hooks/member/useMyContacts";
import { useFetchMyMessages, useMarkAllMyMessagesAsArchived, useMarkAllMyMessagesAsRead, useMarkMyMessagesAsArchived, useMarkMyMessagesAsRead } from "@/hooks/member/useMyMessages";
import { DataTableToolbar } from "@/components/DataTable/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTableFilterField } from "@/lib/types/data-table";
import { DataTable } from "@/components/DataTable/data-table";
import { getColumns } from "./columns";
import { Badge } from "@/components/ui/badge";

type MemberMessageTableProps = {
    user: User;
}

const MemberMessageTable = ({ user }: MemberMessageTableProps): React.ReactElement => {
    const [selectedMessage, setSelectedMessage] = useState<MessageDO | undefined>(undefined);
    
    const [isMessageModalOpen, setMessageModalOpen] = useState<boolean>(false); 
    const [messageMode, setMessageMode] = useState<'new' | 'reply' | 'forward'>("new");
    const [fixedRecipient, setRecipient] = useState<string>("");

    const { data: contacts, isLoading: contactsLoading, error: contactsError } = useMyContacts();
    const { data: receivedMessages, isLoading: messagesLoading, isError: messagesError} = useFetchMyMessages(user?.id);

    const { mutate: markMessageAsRead } = useMarkMyMessagesAsRead(user?.id);
    const { mutate: archiveMessage } = useMarkMyMessagesAsArchived(user?.id);
    const { mutate: archiveAllMessages } = useMarkAllMyMessagesAsArchived(user?.id);
    const { mutate: markAllMessagesAsRead } = useMarkAllMyMessagesAsRead(user?.id);

    const filterFields: DataTableFilterField<MessageDO>[] = [
        {
            id: "is_read",
            label: "Read",
            options: [
                { value: "false", label: "Unread" },
                { value: "true", label: "Read" },
            ]
        },
        {
            id: "category",
            label: "Category",
            options: [
              { label: "All", value: "" },
              { label: "General", value: "general" },
              { label: "System", value: "system" },
              { label: "Invite", value: "invite" },
              { label: "Feedback", value: "feedback" },
              { label: "Announcement", value: "announcement" },
              { label: "Reminder", value: "reminder" },
            ]
          },
          {
            id: "sender_id",
            label: "Sender",
            options: [
                { label: "All", value: "" },
                ...(contacts ?? []).map((c) => ({
                    label: `${c.given_name} ${c.surname}`,
                    value: c.id,
                })),
            ],
          }
    ]

    const handleArchiveMessage = useCallback((message: MessageDO) => {
        setSelectedMessage(message);
        archiveMessage({ messageId: message.id, isArchived: message.is_archived, isRead: message.is_read });
    }, [archiveMessage]);
    
    const handleReadMessage = useCallback((message: MessageDO) => {
        setSelectedMessage(message);
        markMessageAsRead({ messageId: message.id, isRead: message.is_read });
    }, [markMessageAsRead]);
    
    const handleReplyMessage = useCallback((mode: 'reply' | 'forward', message: MessageDO) => {
        setSelectedMessage(message);
        setRecipient(mode === 'reply' ? message.recipient_id : '');
        setMessageMode(mode);
        setMessageModalOpen(true);
    }, []);
    
    const pageSize = 10;
    const pageCount = Math.ceil((receivedMessages?.length || 0) / pageSize);

    const columns = useMemo(() => 
        getColumns({ 
          onArchive: handleArchiveMessage, 
          onMarkRead: handleReadMessage, 
          onReply: (msg: MessageDO) => handleReplyMessage('reply', msg), 
          onForward: (msg: MessageDO) => handleReplyMessage('forward', msg) 
        }), 
      [handleArchiveMessage, handleReadMessage, handleReplyMessage]);
    
    const { table, globalFilter, setGlobalFilter } = useDataTable<MessageDO>({
        data: receivedMessages || [],
        columns,
        pageCount: pageCount || -1,
        filterFields,
        initialState: {
            columnFilters: [{ id: "is_read", value: "false" }],
            sorting: [{ id: "created_at", desc: true }],
            pagination: {
                pageIndex: 0,
                pageSize
            }
        },
        getRowId: (row) => row.id,
        enableRowSelection: true,
        shallow: false,
        clearOnDefault: true
    });

    const selectedRows = table.getSelectedRowModel().rows;
    const selectedMessages = selectedRows.map((row) => row.original);
    const selectedCount = selectedRows.length;
    
    const handleMessageSubmit = () => {
        setMessageModalOpen(false);
    };

    if (messagesError || contactsError) {
        logger.error(messagesError);
    }

    if (messagesLoading || contactsLoading) {
        return (
            <span className="ml-2">Loading...</span>
        );
    }
    
    return (
        <section>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Messages</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                            <Button 
                                onClick={() => {
                                    archiveAllMessages(selectedMessages);
                                    table.resetRowSelection();
                                }}
                                disabled={selectedCount === 0}
                            >
                                <ArchiveRestore className="mr-2 h-4 w-4" />
                                <span>Archive Selected</span>
                                </Button>
                            <Button 
                                onClick={() => {
                                    markAllMessagesAsRead(selectedMessages);
                                    table.resetRowSelection();
                                }}
                                disabled={selectedCount === 0}
                            >
                                <MailCheck className="mr-2 h-4 w-4" />
                                <span>Mark Read Selected</span>
                            </Button>
                            {selectedCount > 0 && (
                                <Badge variant="secondary">
                                    {selectedCount} message{selectedCount > 1 ? 's' : ''} selected
                                </Badge>
                            )}
                        </div>

                        <Button 
                            onClick={() => {
                            setMessageMode('new');
                            setMessageModalOpen(true);
                            }}
                        >
                            <SendHorizonal className="mr-2 h-4 w-4" />
                            <span>New Message</span>
                        </Button>
                    </div>
                    <DataTable table={table}>
                        <DataTableToolbar 
                            table={table} 
                            filterFields={filterFields} 
                            globalFilter={globalFilter}
                            setGlobalFilter={setGlobalFilter} 
                        />
                    </DataTable>
                </CardContent>
            </Card>
            {/* MODALS GO HERE */}
            <MessageModal 
                isOpen={isMessageModalOpen} 
                onConfirm={() => handleMessageSubmit()}
                onCancel={() => setMessageModalOpen(false)}
                members={contacts || []}
                user={user}
                mode={messageMode}
                message={selectedMessage}
                fixedRecipient={fixedRecipient}
                useFixedRecipient={fixedRecipient !== ""}
            />
        </section>
    )
}

export default MemberMessageTable