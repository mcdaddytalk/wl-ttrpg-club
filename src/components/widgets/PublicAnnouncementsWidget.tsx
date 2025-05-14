'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AnnouncementDO } from '@/lib/types/data-objects';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { createSupabaseAnonClient } from '@/utils/supabase/anon';

const LOCAL_STORAGE_KEY = 'announcementsWidgetDismissed';

export function PublicAnnouncementsWidget() {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  useEffect(() => {
    const isDismissed = localStorage.getItem(LOCAL_STORAGE_KEY) === 'true';
    setCollapsed(isDismissed);
  }, []);

  const dismiss = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
    setCollapsed(true);
  };

  const { data: announcements = [] } = useQuery({
    queryKey: ['public-announcements'],
    queryFn: async () => {
      const supabase = await createSupabaseAnonClient();
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('audience', 'public')
        .is('deleted_at', null)
        .eq('published', true)
        .lte('published_at', new Date().toISOString())
        .order('pinned', { ascending: false })
        .order('published_at', { ascending: false });

      if (error) throw error;
      return data as AnnouncementDO[];
    },
  });


  if (!announcements.length) return null;

  if (collapsed) {
    return (
      <div className="my-4 max-w-4xl">
        <div className="flex items-center justify-between bg-yellow-100 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 rounded-md px-4 py-2 shadow">
          <span className="text-sm">📢 You have public announcements</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              localStorage.removeItem(LOCAL_STORAGE_KEY);
              setCollapsed(false);
            }}
          >
            Show
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="max-w-4xl my-6 bg-yellow-50 dark:bg-yellow-950 border-yellow-400 dark:border-yellow-700">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-yellow-900 dark:text-yellow-100">Announcements</h2>
          <Button size="sm" variant="ghost" onClick={dismiss}>
            Dismiss
          </Button>
        </div>
        <ul className="space-y-4">
          {announcements.map((a) => {
            const isExpandable = a.body.length > 50;
            const isExpanded = expandedIds.includes(a.id);
            const toggleExpand = () => {
              setExpandedIds((prev) =>
                prev.includes(a.id) ? prev.filter((id) => id !== a.id) : [...prev, a.id]
              );
            };
          
            const bodyToRender = isExpandable && !isExpanded
              ? a.body.slice(0, 50) + '...'
              : a.body;

            return (
                <li key={a.id} className="text-sm group border-b pb-3">
                    <p className="text-muted-foreground italic">
                        {formatDistanceToNow(new Date(a.published_at!))} ago
                    </p>
                    {isExpandable ? (
                        <>
                        <button
                            onClick={toggleExpand}
                            className="w-full text-left"
                            aria-expanded={isExpanded}
                            aria-controls={`announcement-${a.id}`}
                        >
                            <h3 className="text-base font-semibold text-foreground mt-1 group-hover:underline">
                            {a.title}
                            </h3>
                        </button>
                        <div
                            id={`announcement-${a.id}`}
                            className={cn('prose max-w-none mt-1 transition-all', !isExpanded && 'line-clamp-5')}
                        >
                            <Markdown remarkPlugins={[remarkGfm]}>{bodyToRender}</Markdown>
                        </div>
                        <button
                            onClick={toggleExpand}
                            className="mt-2 text-sm text-blue-600 hover:underline"
                        >
                            {isExpanded ? 'Collapse' : 'Click to expand'}
                        </button>
                        </>
                    ) : (
                        <>
                        <h3 className="text-base font-semibold text-foreground mt-1">
                            {a.title}
                        </h3>
                        <div className="prose max-w-none mt-1">
                            <Markdown remarkPlugins={[remarkGfm]}>{a.body}</Markdown>
                        </div>
                        </>
                    )}
                </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}