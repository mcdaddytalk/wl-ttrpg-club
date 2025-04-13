import React from "react";
import MemberSidebar from "./_components/MemberSidebar";


export default function MemberLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            <MemberSidebar />
            <div className="flex-grow p-6 overflow-auto">
                {children}
            </div>
        </div>
    );
}