import React from 'react';
import GMSidebar from '@/components/GMSidebar';

export default function GMLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            <GMSidebar />
            <div className="flex-grow p-6 overflow-auto">
                {children}
            </div>
        </div>
    );
}