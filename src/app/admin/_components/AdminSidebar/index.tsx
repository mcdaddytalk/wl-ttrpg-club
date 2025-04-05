"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { useAdminSidebarStore } from "@/store/adminSidebarStore"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

const navItems = [
    { href: "/admin", label: "Dashboard", icon: '📊' },
    { href: "/admin/membership", label: "My Members", icon: '👤' },
    { href: "/admin/locations", label: "Locations", icon: '📍' },
    { href: "/admin/broadcasts", label: "Broadcasts", icon: '📫' },
    { href: "/admin/announcements", label: "Announcements", icon: '📣' },
    { href: "/admin/tasks", label: "Tasks", icon: '📝' },
    { href: "/admin/tags", label: "Tags", icon: '🏷️' },
]

export default function AdminSidebar(): React.ReactElement {
    const { isCollapsed, toggleCollapse } = useAdminSidebarStore()
    const pathName = usePathname()

    return (
        <div
            id="admin-sidebar"
            className={cn(
                'flex flex-col bg-slate-800 text-white transition-width duration-300',
                isCollapsed ? 'w-16' : 'w-32'
            )}
        >
            {/* Toggle button */}
            <Button
                aria-expanded={isCollapsed}
                aria-controls="sidebar-nav"
                className="p-2 text-slate-400 hover:text-white"
                onClick={toggleCollapse}
            >
                {isCollapsed ? 'Expand ➤' : 'Collapse ❮'}
            </Button>

            {/* Navigation items */}
            <nav id="sidebar-nav" className="mt-4 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            'group flex items-center rounded-md px-3 py-2 text-sm font-medium leading-6 text-slate-400 hover:text-white',
                            pathName === item.href ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                        )}
                    >
                        {isCollapsed ? (
                                <Tooltip delayDuration={0}>
                                    <TooltipTrigger asChild>
                                        <span>{item.icon}</span>
                                    </TooltipTrigger>
                                    <TooltipContent sideOffset={5} side="right">{item.label}</TooltipContent>
                                </Tooltip>
                            ) : ( 
                                <span className="mr-4">{item.icon} {item.label}</span>
                            )}
                    </Link>
                ))}
            </nav>
        </div>
    )
}