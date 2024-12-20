"use client"

// import { AdminDrawer } from "@/components/AdminDrawer";
import AdminMembersTable from "@/app/admin/_components/AdminMembersTable/AdminMembersTable";
// import { DataTable } from "@/components/DataTable/data-table";
import { DataTableSkeleton } from "@/components/DataTable/data-table-skeleton";
import { Shell } from "@/components/Shell";
import { Suspense } from "react";

export default function AdminDashboardClient(): React.ReactElement {
  
  return (
      <Shell className="gap-2">
        {/* Navbar */}
        {/*
        <header className="flex justify-between items-center p-4 shadow">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <AdminDrawer />
        </header>
        */}
        {/* Main Content */}
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
          <AdminMembersTable />
        </Suspense>
      </Shell>
    );
}