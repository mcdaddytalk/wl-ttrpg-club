import { create }  from 'zustand';
import { persist } from 'zustand/middleware';

type GMSidebarState = {
    isCollapsed: boolean;
    toggleCollapse: () => void;
    setCollapsed: (collapsed: boolean) => void;
};

export const useGMSidebarStore = create(
    persist<GMSidebarState>(
        (set) => ({
            isCollapsed: false,
            toggleCollapse: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
            setCollapsed: (collapsed: boolean) => set(() => ({ isCollapsed: collapsed })),
        }),
        {
            name: "gm-sidebar-state",
        }
    )
);