'use client';

import { useState } from 'react';
import { useMemberAnnouncements } from '@/hooks/useMemberAnnouncements';
import { useAuth } from '@/hooks/useAuth';
import { 
  Card, 
  CardContent, 
//  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@/hooks/useQueryClient';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useQueryState,
  parseAsInteger,
  parseAsBoolean,
  parseAsString,
} from 'nuqs';
import { cn } from '@/lib/utils';
import { Markdown } from './Markdown';

dayjs.extend(relativeTime);

const dateFilters = [
  { label: 'All', value: 'all' },
  { label: 'Last 7 Days', value: dayjs().subtract(7, 'day').toDate() },
  { label: 'Last 30 Days', value: dayjs().subtract(30, 'day').toDate() },
];

export default function PaginatedAnnouncementList() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(0));
  const [showUnreadOnly, setShowUnreadOnly] = useQueryState('unread', parseAsBoolean.withDefault(false));
  const [sinceParam, setSinceParam] = useQueryState('since', parseAsString.withDefault(''));

  const since = sinceParam && sinceParam !== 'all' ? new Date(sinceParam) : null;  
  const pageSize = 5;
  
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
                <div className="flex items-center gap-2">
                  {!a.pinned && a.isUnread && (
                    <Badge variant="outline" className="text-xs">Unread</Badge>
                  )}
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
              </div>
              <div className="text-sm text-muted-foreground mb-2">
                Published {dayjs(a.published_at).fromNow()} ago
              </div>
              <div className={cn('prose max-w-none', !isExpanded && isExpandable && 'line-clamp-5')}>
                <Markdown>{bodyToRender}</Markdown>
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
    <Card className="space-y-6">
      <CardHeader className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b py-4 px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-2">
          <CardTitle className="text-lg font-semibold">Announcements</CardTitle>
          <div className="flex w-full sm:w-auto justify-end sm:justify-normal items-center gap-2">
            <Select
              value={sinceParam}
              onValueChange={(val) => setSinceParam(val)}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                {dateFilters.map(({ label, value }) => (
                  <SelectItem key={label} value={typeof value === 'string' ? value : value?.toISOString() || "all"}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant={showUnreadOnly ? "default" : "outline"}
              onClick={() => setShowUnreadOnly((prev: boolean) => !prev)}
            >
              {showUnreadOnly ? "Show All" : "Show Unread Only"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => queryClient.invalidateQueries()}>
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Total unread: <span className="font-semibold">{totalUnread}</span>
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
                <Select
                  value={sinceParam}
                  onValueChange={(val) => {
                    // const selected = dateFilters.find(df => df.value?.toISOString() === val);
                    setSinceParam(val);
                  }}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Filter by date" />
                    {since?.toISOString()}
                  </SelectTrigger>
                  <SelectContent>
                    {dateFilters.map(({ label, value }) => (
                      <SelectItem key={label} value={typeof value === 'string' ? value : value?.toISOString() || "all"}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button size="sm" variant="outline" onClick={markAllUnreadAsRead} disabled={totalUnread === 0}>
                  Mark All Unread as Read
                </Button>
              </div>
            </div>
            {renderAnnouncements(unpinned)}
          </div>
        )} 
        <div className="flex justify-between items-center pt-2">
          <Button variant="ghost" onClick={() => setPage((p: number) => Math.max(0, p - 1))} disabled={page === 0}>
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page + 1} of {totalPages || 1}
          </span>
          <Button variant="ghost" onClick={() => setPage((p: number) => p + 1)} disabled={page + 1 >= totalPages}>
            Next
          </Button>
        </div>       
      </CardContent>   
    </Card>
  );
}