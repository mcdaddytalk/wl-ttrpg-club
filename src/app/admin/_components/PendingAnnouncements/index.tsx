'use client'

import { usePendingAnnouncements } from "@/hooks/admin/usePendingAnnouncements";

export function PendingAnnouncements() {
    const { data } = usePendingAnnouncements();
    if (!data) return null;
    return (
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span>Unapproved</span>
          <span className="font-medium">{data.count}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Latest</span>
          <span className="truncate text-right">{data.latestTitle}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Created At</span>
          <span className="text-muted-foreground text-xs">{new Date(data.latestCreatedAt).toLocaleString()}</span>
        </div>
      </div>
    );
  }