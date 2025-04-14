'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useContactSubmissions } from '@/hooks/admin/useAdminContactSubmissions';
import { formatDistanceToNow } from 'date-fns';

export default function AdminContactSubmissionsPage() {
  const { data = [], isLoading } = useContactSubmissions();

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Contact Submissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <p>Loading...</p>
          ) : data.length === 0 ? (
            <p>No submissions yet.</p>
          ) : (
            <ul className="space-y-4">
              {data.map((entry: any) => (
                <li key={entry.id} className="border-b pb-4">
                  <p><strong>{entry.name}</strong> ({entry.email})</p>
                  <p className="text-sm text-muted-foreground">
                    {entry.category} • {formatDistanceToNow(new Date(entry.created_at))} ago
                  </p>
                  <p className="mt-2 whitespace-pre-line">{entry.message}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
