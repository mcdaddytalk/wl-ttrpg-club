'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DeliveryMethod, MemberDO } from '@/lib/types/custom';
import { SelectContent } from '@radix-ui/react-select';
import useSession from '@/utils/supabase/use-session';

export default function CreateBroadcastPage() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [mode, setMode] = useState<DeliveryMethod>('both');
  const [members, setMembers] = useState<MemberDO[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const session = useSession();
  const user = session?.user;
  const router = useRouter();

  useEffect(() => {
    async function fetchMembers() {
        const res = await fetch('/api/admin/members', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (!res.ok) {
            throw new Error('Failed to fetch members');
        }
        const data = await res.json();
        console.log(data);
        setMembers(data)
    }
    fetchMembers();
  }, [])

  const toggleRecipient = (id: string) => {
    setSelectedRecipients((prev) =>
      prev.includes(id) ? prev.filter((recipient) => recipient !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    const res = await fetch('/api/broadcasts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sender_id: user?.id, subject, message, mode, recipients: selectedRecipients }),
    });

    if (res.ok) {
      router.push('/admin/broadcasts');
    } else {
      console.error('Failed to create broadcast');
    }
  };


  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create Broadcast</h1>
      <div className="space-y-4">
        <Input
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <Textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Select value={mode} onValueChange={(value) => setMode(value as DeliveryMethod)}>
          <SelectTrigger>
            <SelectValue placeholder="Delivery Mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
            <SelectItem value="both">Both</SelectItem>
          </SelectContent>
        </Select>
        <h2 className="text-lg font-semibold">Select Recipients</h2>
        <div className="grid gap-2">
          {members.map((member) => (
            <div key={member.id} className="flex items-center">
              <Checkbox
                id={`recipient-${member.id}`}
                checked={selectedRecipients.includes(member.id)}
                onCheckedChange={() => toggleRecipient(member.id)}
              />
              <label htmlFor={`recipient-${member.id}`} className="ml-2">
                {`${member.given_name} ${member.surname}`}
              </label>
            </div>
          ))}
        </div>
        <Button onClick={handleSubmit}>Send Broadcast</Button>
      </div>
    </div>
  );
}
