import { create }  from 'zustand';
import { persist } from 'zustand/middleware';

type AdminSidebarState = {
    isCollapsed: boolean;
    toggleCollapse: () => void;
    setCollapsed: (collapsed: boolean) => void;
};

export const useAdminSidebarStore = create(
    persist<AdminSidebarState>(
        (set) => ({
            isCollapsed: false,
            toggleCollapse: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
            setCollapsed: (collapsed: boolean) => set(() => ({ isCollapsed: collapsed })),
        }),
        {
            name: "admin-sidebar-state",
        }
    )
);