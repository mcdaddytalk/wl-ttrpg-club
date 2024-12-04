"use client"

// import { AdminDrawer } from "@/components/AdminDrawer";
import AdminMembersTable from "@/components/AdminMembersTable/AdminMembersTable";

export default function AdminDashboardClient(): React.ReactElement {
  return (
      <div className="flex flex-col">
        {/* Navbar */}
        {/*
        <header className="flex justify-between items-center p-4 shadow">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <AdminDrawer />
        </header>
        */}
        {/* Main Content */}
        <main className="p-4 overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-4">Manage Members</h2>
          {/* Members Table */}
          <AdminMembersTable />
        </main>
      </div>
    );
}