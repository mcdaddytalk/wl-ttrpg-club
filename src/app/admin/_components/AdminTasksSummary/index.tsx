'use client'

import { useAdminTasksSummary } from "@/hooks/admin/useAdminTaskSummary";

export function AdminTaskSummary() {
    const { data } = useAdminTasksSummary();
    if (!data) return null;
    return (
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span>Pending Tasks</span>
          <span className="font-medium">{data.pendingTasks}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Role Requests</span>
          <span className="font-medium">{data.roleRequests}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Verifications</span>
          <span className="font-medium">{data.verifications}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>GM Approvals</span>
          <span className="font-medium">{data.gmApprovals}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Member Approvals</span>
          <span className="font-medium">{data.memberApprovals}</span>
        </div>
      </div>
    );
  }