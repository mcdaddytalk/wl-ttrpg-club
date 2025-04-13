"use client";

import { useAdminFeedback } from "@/hooks/admin/useAdminFeedback";
import AdminFeedbackTable from "./AdminFeedbackTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminFeedbackDashboard() {
  const { data: feedback, isLoading, isError } = useAdminFeedback();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Feedback & Suggestions</CardTitle>
      </CardHeader>
      <CardContent>
        <AdminFeedbackTable data={feedback || []} isLoading={isLoading} isError={isError} />
      </CardContent>
    </Card>
  );
}