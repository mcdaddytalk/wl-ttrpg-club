'use client'

import { redirect, useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { BroadcastMessage, BroadcastRecipient } from '@/lib/types/custom';
import { Button } from '@/components/ui/button';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchMembersFull } from '@/queries/fetchMembers';
import { useQueryClient } from '@/hooks/useQueryClient';

export default function BroadcastDetailsPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  
  const { data: messageData, isLoading: isLoadingMessage, error: messageError } = useQuery({
    queryKey: ['broadcast', 'messages', id],
    queryFn: async () => {
      const res = await fetch(`/api/broadcasts/${id}`);
      const data = await res.json();
      return data;
    },
    enabled: !!id,
  })

  const { message: details, recipients } = messageData as { message: BroadcastMessage, recipients: BroadcastRecipient[] } || {}

  const { data: members, isLoading: isLoadingMembers, error: membersError } = useQuery(fetchMembersFull())

  const sendMessageFn = async () => {
    const res = await fetch(`/api/messaging/broadcast`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messageId: id }),
    });
    const data = await res.json();
    console.log(data);
  };

  const sendMessage = useMutation({
    mutationFn: async () => await sendMessageFn(),
    onSuccess: () => {
      console.log('Message sent successfully');
      queryClient.invalidateQueries({ queryKey: ['broadcast', 'messages', id] });
    },
    onError: (error) => {
      console.error('Error sending message:', error);
    },
  })

  if (isLoadingMessage || isLoadingMembers) {
    return <div>Loading...</div>;
  }

  if (messageError || membersError) {
    redirect("/error");
  }

  const enhancedRecipients = members?.filter((member) => recipients.some((recipient) => recipient.recipient_id === member.id)).map((member) => {
    return {
      ...member,
      delivery_method: recipients.find((recipient) => recipient.recipient_id === member.id)?.delivery_method,
      delivery_status: recipients.find((recipient) => recipient.recipient_id === member.id)?.delivery_status
    }
  })
  
  

  return (
    <div className="container mx-auto py-8">
      {details && (
        <Card key={details.id}>
          <div className="flex flex-row gap-2">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">{details.subject}</h1>
                <p>{details.message}</p>
                <p>Mode: {details.mode}</p>
            </div>
            <div className="flex flex-col gap-2">
                <Button
                    onClick={() => {
                        sendMessage.mutate()
                    }}
                >
                    Send
                </Button>
            </div>
          </div>
        </Card>
      )}
      <h2 className="text-xl font-semibold mb-4">Recipients</h2>
      <div className="grid gap-4">
        {enhancedRecipients?.map((recipient) => (
          <Card key={recipient.id}>
            <p>Recipient: {`${recipient.displayName} ${recipient.id}`}</p>
            <p>Email: {recipient.email}</p>
            <p>Phone: {recipient.phone}</p>
            <p>Method: {recipient.delivery_method}</p>
            <p>Status: {recipient.delivery_status}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
