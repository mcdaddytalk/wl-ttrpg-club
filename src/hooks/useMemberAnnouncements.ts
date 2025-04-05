import { useAnnouncements } from '@/hooks/useAnnouncements';
import { useAnnouncementsRead } from '@/hooks/useAnnouncementsRead';

export type AnnouncementFilters = {
  onlyUnread?: boolean;
  onlyPinned?: boolean;
  since?: Date;
  page?: number;
  pageSize?: number;
};

export function useMemberAnnouncements(userId?: string, filters: AnnouncementFilters = {}) {
  const {
    announcements = [],
    isLoading: isLoadingAnnouncements,
    isError: isErrorAnnouncements,
  } = useAnnouncements();

  const {
    data: announcementReads = [],
    isLoading: isLoadingReads,
    isError: isErrorReads,
  } = useAnnouncementsRead(userId);

  const readIds = new Set(announcementReads.map((r) => r.announcement_id));

  const annotatedAnnouncements = announcements.map((a) => ({
    ...a,
    isRead: a.pinned ? false : readIds.has(a.id),
    isUnread: a.pinned ? false : !readIds.has(a.id),
  }));

  let pinnedAnnouncements = annotatedAnnouncements.filter((a) => a.pinned);
  let unpinnedAnnouncements = annotatedAnnouncements.filter((a) => !a.pinned);

  if (filters.since) {
    unpinnedAnnouncements = unpinnedAnnouncements.filter((a) => new Date(a.published_at!) >= filters.since!);
  }
  if (filters.onlyUnread) {
    unpinnedAnnouncements = unpinnedAnnouncements.filter((a) => a.isUnread);
  }
  if (filters.onlyPinned) {
    pinnedAnnouncements = pinnedAnnouncements.filter((a) => a.pinned);
    unpinnedAnnouncements = [];
  }
  
  if (filters.pageSize) {
    const start = (filters.page ?? 0) * filters.pageSize;
    const end = start + filters.pageSize;
    unpinnedAnnouncements = unpinnedAnnouncements.slice(start, end);
  }

  const combined = [...pinnedAnnouncements, ...unpinnedAnnouncements];
  const total = unpinnedAnnouncements.length;

  return {
    announcements: combined,
    total,
    isLoading: isLoadingAnnouncements || isLoadingReads,
    isError: isErrorAnnouncements || isErrorReads,
  };
}