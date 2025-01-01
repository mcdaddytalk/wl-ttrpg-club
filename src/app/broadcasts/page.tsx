"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button'; // Adjust import based on your shadcn setup
import { Card } from '@/components/ui/card'; // Replace with your Card component
import { BroadcastMessage } from '@/lib/types/custom';

export default function BroadcastListPage() {
  const [broadcasts, setBroadcasts] = useState<BroadcastMessage[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch broadcasts from the API
    async function fetchBroadcasts() {
      const res = await fetch('/api/broadcasts'); // Implement this API to fetch all broadcasts
      const data = await res.json();
      setBroadcasts(data);
    }
    fetchBroadcasts();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Broadcasts</h1>
        <Button onClick={() => router.push('/broadcasts/create')}>Create Broadcast</Button>
      </div>
      <div className="grid gap-4">
        {broadcasts.map((broadcast) => (
          <Card key={broadcast.id} onClick={() => router.push(`/broadcasts/${broadcast.id}`)}>
            <h2 className="font-semibold">{broadcast.subject}</h2>
            <p>Mode: {broadcast.mode}</p>
            <p>Created At: {new Date(broadcast.created_at).toLocaleString()}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
