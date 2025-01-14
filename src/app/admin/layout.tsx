import React from "react";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            <AdminSidebar />
            <div className="flex-grow p-6 overflow-auto">
                {children}
            </div>
        </div>
    );
}