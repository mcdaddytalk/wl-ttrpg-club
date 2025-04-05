import { Suspense } from "react";
import AdminTaskPageShell from "./AdminTaskShell";

export default function AdminTasksPage() {
  return (
    <main className="container max-w-5xl py-8 space-y-6">
      <Suspense fallback={<div>Loading...</div>}>
        <AdminTaskPageShell />
      </Suspense>
    </main>
  );
}
