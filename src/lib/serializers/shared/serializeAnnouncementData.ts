import { AnnouncementDO } from "@/lib/types/data-objects";

export function serializeAnnouncementData(row: any): AnnouncementDO {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    audience: row.audience,
    pinned: !!row.pinned,
    published: !!row.published,
    published_at: row.published_at,
    notify_on_publish: !!row.notify_on_publish,
    expires_at: row.expires_at,
    deleted_at: row.deleted_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
    author_id: row.author_id,
    approved_by: row.approved_by
  };
}
