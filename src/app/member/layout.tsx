import React from "react";
import Sidebar from "@/components/Sidebar";

export default function MemberLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-grow p-6 overflow-auto">
                {children}
            </div>
        </div>
    );
}