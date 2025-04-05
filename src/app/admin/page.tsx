'use client'

import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminUserSummary } from "./_components/AdminUserSummary";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { AdminTaskSummary } from "./_components/AdminTasksSummary";
import { PendingAnnouncements } from "./_components/PendingAnnouncements";
import { SupportInboxSummary } from "./_components/SupportInboxSummary";

export default function AdminDashboardPage() {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        {/* User Summary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>User Summary</CardTitle>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin/membership">
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<p>Loading user stats...</p>}>
              <AdminUserSummary />
            </Suspense>
          </CardContent>
        </Card>
  
        {/* Admin Tasks Summary */}
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Admin Tasks</CardTitle>
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/tasks">
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                <Suspense fallback={<p>Loading tasks...</p>}>
                    <AdminTaskSummary />
                </Suspense>
            </CardContent>
        </Card>
  
        {/* Pending Announcements */}
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Pending Announcements</CardTitle>
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/announcements">
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                <Suspense fallback={<p>Loading announcements...</p>}>
                    <PendingAnnouncements />
                </Suspense>
            </CardContent>
        </Card>
  
        {/* Support Messages Summary */}
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Support Inbox</CardTitle>
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/support">
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                <Suspense fallback={<p>Loading messages...</p>}>
                    <SupportInboxSummary />
                </Suspense>
            </CardContent>
        </Card>
      </div>
    );
  }