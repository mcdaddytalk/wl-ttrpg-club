'use client'

import { useSupportMessagesSummary } from "@/hooks/admin/useAdminSupportMessages";

export function SupportInboxSummary() {
    const { data } = useSupportMessagesSummary();
    if (!data) return null;
    return (
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span>Unread Messages</span>
          <span className="font-medium">{data.unreadCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Latest From</span>
          <span className="font-medium">{data.latestSender}</span>
        </div>
        <div className="text-muted-foreground text-xs italic">&quot;{data.latestMessageSnippet}&quot;</div>
        <div className="text-muted-foreground text-xs">Received: {new Date(data.latestReceivedAt).toLocaleString()}</div>
      </div>
    );
  }