import { create }  from 'zustand';
import { persist } from 'zustand/middleware';

type SidebarState = {
    isCollapsed: boolean;
    toggleCollapse: () => void;
    setCollapsed: (collapsed: boolean) => void;
};

export const useSidebarStore = create(
    persist<SidebarState>(
        (set) => ({
            isCollapsed: false,
            toggleCollapse: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
            setCollapsed: (collapsed: boolean) => set(() => ({ isCollapsed: collapsed })),
        }),
        {
            name: "sidebar-state",
        }
    )
);