'use client'

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { BroadcastMessage, BroadcastRecipient } from '@/lib/types/custom';
import { Button } from '@/components/ui/button';

export default function BroadcastDetailsPage() {
  const { id } = useParams();
  const [details, setDetails] = useState<BroadcastMessage | null>(null);
  const [recipients, setRecipients] = useState<BroadcastRecipient[]>([]);

  useEffect(() => {
    async function fetchDetails() {
      const res = await fetch(`/api/broadcasts/${id}`);
      const data = await res.json();
      setDetails(data.message);
      setRecipients(data.recipients);
    }
    fetchDetails();
  }, [id]);

  const sendMessage = async () => {
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

  return (
    <div className="container mx-auto py-8">
      {details && (
        <div className="flex flex-row gap-4 mb-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">{details.subject}</h1>
                <p>{details.message}</p>
                <p>Mode: {details.mode}</p>
            </div>
            <div className="flex flex-col gap-2">
                <Button
                    onClick={() => {
                        sendMessage()
                    }}
                >
                    Send
                </Button>
            </div>
        </div>
      )}
      <h2 className="text-xl font-semibold mb-4">Recipients</h2>
      <div className="grid gap-4">
        {recipients.map((recipient) => (
          <Card key={recipient.id}>
            <p>Recipient: {recipient.recipient_id}</p>
            <p>Method: {recipient.delivery_method}</p>
            <p>Status: {recipient.delivery_status}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
