"use client"

import { ContactListDO, MessageDO } from "@/lib/types/custom";
// import useSession from "@/utils/supabase/use-session";
import { User } from "@supabase/supabase-js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@/hooks/useQueryClient";
import React, { useState } from "react"
import { fetchMessages } from "@/queries/fetchMessages";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { columns } from "./columns";
import { DataTable } from "./DataTable";
import { Button } from "@/components/ui/button";
import NewMessageModal from "../NewMessageModal";
import { ArchiveRestore, MailCheck, SendHorizonal } from "lucide-react";

const fetchContactList = async (): Promise<ContactListDO[]> => {
    const response = await fetch('/api/members/contacts',
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
    if (!response.ok) {
        throw new Error('Failed to fetch contact list');
    }
    const contacts = await response.json();
    return contacts;
}

type MemberMessageTableProps = {
    user: User;
}

const MemberMessageTable = ({ user }: MemberMessageTableProps): React.ReactElement => {
    const queryClient = useQueryClient();

    const [selectedMessage, setSelectedMessage] = useState<MessageDO | null>(null);
    const [selectedMessages] = useState<MessageDO[]>([]);

    const [isNewMessageModalOpen, setNewMessageModalOpen] = useState<boolean>(false); 
    
    const { mutate: markMessageAsRead } = useMutation({
        mutationFn: async (messageId: string) => {
            return await fetch(`/api/messages/${messageId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    is_read: !selectedMessage?.is_read
                }),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages', 'unread', user?.id] });
        },
        onError: () => {
            console.error('Error marking message as read');
        },
    })
    
    const { mutate: archiveMessage } = useMutation({
        mutationFn: async (messageId: string) => {
            return await fetch(`/api/messages/${messageId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ is_archived: !selectedMessage?.is_archived }),
            });            
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages', 'unread', user?.id] });
        },
        onError: () => {
            console.error('Error archiving message');
        },
    })
    
    const { mutate: archiveAllMessages } = useMutation({
        mutationFn: async () => {
            const response = await fetch(`/api/messages`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: user?.id, selectedMessages }),
            });
            if (!response.ok) {
                throw new Error('Failed to delete all messages');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages', 'unread', user?.id] });
        }
    })    
    
    const { mutate: markAllMessagesAsRead } = useMutation({
        mutationFn: async () => {
            const response = await fetch(`/api/messages`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: user.id, is_read: true, selectedMessages }),
            });
            if (!response.ok) {
                throw new Error('Failed to mark all messages as read');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages', 'unread', user?.id] });
        },
    })

    const { data: membersData, isLoading: membersLoading, isError: membersError} = useQuery<ContactListDO[]>({
        queryKey: ['members', 'contact_list', user?.id],
        queryFn: () => fetchContactList(),
        initialData: [],
        enabled: !!user?.id,
    })

    const { data: receivedMessages, isLoading: messagesLoading, isError: messagesError} = useQuery<MessageDO[]>({
        queryKey: ['messages', 'unread', user?.id],
        queryFn: () => fetchMessages(user?.id, 'unread'),
        initialData: [],
        enabled: !!user?.id,
    });

    const handleNewMessageSubmit = () => {
        setNewMessageModalOpen(false);
    };

    const handleReplyMessage = (message: MessageDO) => {
        setSelectedMessage(message);
        setNewMessageModalOpen(true);
    };

    const handleForwardMessage = (message: MessageDO) => {
        setSelectedMessage(message);
        setNewMessageModalOpen(true);
    };
    
    if (messagesError || membersError) {
        console.error(messagesError);
    }

    if (messagesLoading || membersLoading) {
        return (
            <span className="ml-2">Loading...</span>
        );
    }
    
    if (!receivedMessages || receivedMessages.length === 0) {
        return (
            <span className="ml-2">No messages found.</span>
        );
    }

    const enhancedMessages = receivedMessages.map((message) => {
        return {
            ...message,
            onArchive: () => archiveMessage(message.id),
            onMarkAsRead: () => markMessageAsRead(message.id),
            onReply: () => handleReplyMessage(message),
            onForward: () => handleForwardMessage(message),
        };
    });
    
    return (
        <section>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Messages</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <Button onClick={() => archiveAllMessages()}>
                            <ArchiveRestore className="mr-2 h-4 w-4" /><span>Archive Selected</span>
                        </Button>
                        <Button onClick={() => markAllMessagesAsRead()}>
                            <MailCheck className="mr-2 h-4 w-4" /><span>Mark Read Selected</span>
                        </Button>
                        <Button onClick={() => setNewMessageModalOpen(true)}>
                            <SendHorizonal className="mr-2 h-4 w-4" /><span>New Message</span>
                        </Button>
                    </div>
                    <DataTable<MessageDO, unknown> columns={columns} data={enhancedMessages} />
                </CardContent>
            </Card>
            {/* MODALS GO HERE */}
            <NewMessageModal 
                isOpen={isNewMessageModalOpen} 
                onConfirm={() => handleNewMessageSubmit()}
                onCancel={() => setNewMessageModalOpen(false)}
                members={membersData}
                user={user}
            />
        </section>
    )
}

export default MemberMessageTable