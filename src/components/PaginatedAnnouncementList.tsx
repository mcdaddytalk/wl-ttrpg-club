'use client';

import { useState } from 'react';
import { useMemberAnnouncements } from '@/hooks/useMemberAnnouncements';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { formatDistanceToNow, subDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@/hooks/useQueryClient';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

const dateFilters = [
    { label: 'All', value: null },
    { label: 'Last 7 Days', value: subDays(new Date(), 7) },
    { label: 'Last 30 Days', value: subDays(new Date(), 30) },
]

export default function PaginatedAnnouncementList() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const pageSize = 5;
  const [page, setPage] = useState(0);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [since, setSince] = useState<Date | null>(null);

  const { announcements = [], total, isLoading } = useMemberAnnouncements(user?.id, {
    page,
    pageSize,
    onlyUnread: showUnreadOnly,
    since: since || undefined,
  });

  const totalUnread = announcements.filter((a) => !a.pinned && a.isUnread).length;
  const totalPages = Math.ceil((total || 0) / pageSize);

  const handleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/announcements/${id}/read`, { method: 'POST' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcement-reads', user?.id] });
      toast.success('Announcement marked as read');
    },
    onError: () => {
      toast.error('Failed to mark announcement as read');
    }
  });

  const markAllUnreadAsRead = () => {
    const unreadIds = announcements.filter(a => !a.pinned && a.isUnread).map(a => a.id);
    Promise.all(unreadIds.map(id => fetch(`/api/announcements/${id}/read`, { method: 'POST' })))
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['announcement-reads', user?.id] });
        toast.success('Marked all unread as read');
      })
      .catch(() => toast.error('Failed to mark all as read'));
  };

  if (isLoading) return <div>Loading announcements...</div>;

  const pinned = announcements.filter(a => a.pinned);
  const unpinned = announcements.filter(a => !a.pinned);

  const renderAnnouncements = (items: typeof announcements) => (
    <div className="space-y-4">
      {items.map((a) => {
        const isExpanded = expandedIds.includes(a.id);
        const isExpandable = a.body.length > 50;
        const bodyToRender = isExpandable && !isExpanded ? a.body.slice(0, 50) + '...' : a.body;

        return (
          <Card
            key={a.id}
            className={cn(
              isExpandable && 'cursor-pointer',
              a.isRead && 'bg-muted/50 text-muted-foreground'
            )}
            onClick={isExpandable ? () => handleExpand(a.id) : undefined}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <h3 className={cn('text-lg font-bold', a.isUnread && 'text-foreground')}>{a.title}</h3>
                {!a.pinned && a.isUnread && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead.mutate(a.id);
                    }}
                  >
                    Mark Read
                  </Button>
                )}
              </div>
              <div className="text-sm text-muted-foreground mb-2">
                Published {formatDistanceToNow(new Date(a.published_at!))} ago
              </div>
              <div className={cn('prose max-w-none', !isExpanded && isExpandable && 'line-clamp-5')}>
                <Markdown remarkPlugins={[remarkGfm]}>{bodyToRender}</Markdown>
              </div>
              {isExpandable && (
                <div className="mt-2 text-sm text-blue-600">
                  {isExpanded ? 'Collapse' : 'Click to expand'}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
                Total unread: <span className="font-semibold">{totalUnread}</span>
            </div>
            <Button
            variant={showUnreadOnly ? 'default' : 'outline'}
            onClick={() => setShowUnreadOnly((prev) => !prev)}
            >
            {showUnreadOnly ? 'Show All' : 'Show Unread Only'}
            </Button>
        </div>

        {pinned.length > 0 && (
            <div className="space-y-2">
            <h4 className="text-md font-semibold text-muted-foreground">Pinned</h4>
            {renderAnnouncements(pinned)}
            </div>
        )}

        {unpinned.length > 0 && (
            <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h4 className="text-md font-semibold text-muted-foreground">Announcements</h4>
                    <div className="flex gap-2 items-center">
                        <select
                            className="text-sm border rounded px-2 py-1 bg-background"
                            value={since?.toISOString() || ''}
                            onChange={(e) => {
                            const selected = dateFilters.find(df => df.value?.toISOString() === e.target.value);
                            setSince(selected?.value ?? null);
                            }}
                        >
                            {dateFilters.map(({ label, value }) => (
                            <option key={label} value={value?.toISOString() || ''}>{label}</option>
                            ))}
                        </select>
                        <Button size="sm" variant="outline" onClick={markAllUnreadAsRead} disabled={totalUnread === 0}>
                            Mark All Unread as Read
                        </Button>
                    </div>
                </div>
                {renderAnnouncements(unpinned)}
            </div>
        )}

        <div className="flex justify-between items-center pt-2">
            <Button variant="ghost" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>
                Previous
            </Button>
            <span className="text-sm text-muted-foreground">
                Page {page + 1} of {totalPages || 1}
            </span>
            <Button variant="ghost" onClick={() => setPage((p) => p + 1)} disabled={page + 1 >= totalPages}>
                Next
            </Button>
        </div>
    </div>
  );
}