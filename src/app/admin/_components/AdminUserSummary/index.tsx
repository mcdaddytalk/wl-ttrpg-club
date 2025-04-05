'use client'

import { useAdminUserStats } from "@/hooks/admin/useAdminUserStats";

export function AdminUserSummary() {
    const { data } = useAdminUserStats();
  if (!data) return null;
  return (
    <div className="space-y-2 text-sm">
      <div className="flex items-center justify-between">
        <span>Total Members</span>
        <span className="font-medium">{data.totalMembers}</span>
      </div>
      <div className="flex items-center justify-between">
        <span>Active This Week</span>
        <span className="font-medium">{data.activeThisWeek}</span>
      </div>
      <div className="flex items-center justify-between">
        <span>Active This Month</span>
        <span className="font-medium">{data.activeThisMonth}</span>
      </div>
      <div className="flex items-center justify-between">
        <span>New Signups</span>
        <span className="font-medium">{data.newSignups}</span>
      </div>
    </div>
  );
}