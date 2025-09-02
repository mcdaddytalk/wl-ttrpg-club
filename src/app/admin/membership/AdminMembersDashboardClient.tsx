"use client"

import AdminMembersTable from "./_components/AdminMembersTable/AdminMembersTable";
import { DataTableSkeleton } from "@/components/DataTable/data-table-skeleton";
import { Shell } from "@/components/Shell";
import { ErrorBoundary } from "@sentry/nextjs";
import { User } from "@supabase/supabase-js";
import { Suspense } from "react";

interface AdminMembersDashboardClientProps {
    user: User;
}
export default function AdminMembersDashboardClient({ user }: AdminMembersDashboardClientProps): React.ReactElement {
  
  return (
      <Shell className="gap-2">
        {/* Main Content */}
        <ErrorBoundary fallback={<div className="text-destructive">Failed to load members.</div>}>  
          <Suspense fallback={
            <DataTableSkeleton 
              columnCount={7}
              searchableColumnCount={3}
              filterableColumnCount={5}
              cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem", "8rem"]}
              shrinkZero
            />
          }>
            {/* Members Table */}
            <AdminMembersTable user={user}/>
          </Suspense>
        </ErrorBoundary>
      </Shell>
    );
}

// export default function AdminMembersDashboardClient() {
//   return (
//     <Shell className="gap-2">
//       <ErrorBoundary fallback={<div className="text-destructive">Failed to load members.</div>}>  
//         <AdminMembersTable />
//       </ErrorBoundary>
//     </Shell>
//   )
// }