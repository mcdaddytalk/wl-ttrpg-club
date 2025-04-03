export interface AdminUserStats {
    totalMembers: number;
    activeThisWeek: number;
    activeThisMonth: number;
    newSignups: number;
}

export interface AdminTaskStats {
    pendingTasks: number;
    roleRequests: number;
    verifications: number;
    gmApprovals: number;
    memberApprovals: number;
}

export interface PendingAnnouncementsStats {
    count: number;
    latestTitle: string;
    latestCreatedAt: string;
}

export interface SupportMessagesStats {
    unreadCount: number;
    latestMessageSnippet: string;
    latestSender: string;
    latestReceivedAt: string;
}