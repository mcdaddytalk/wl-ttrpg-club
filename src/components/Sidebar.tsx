"use client"

import Link from "next/link"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { useSidebarStore } from "@/store/sidebarStore"

const navItems = [
    { href: "/member/my-games", label: "My Games", icon: '🎲' },
    { href: "/member/profile", label: "Profile", icon: '👤' },
    { href: "/member/messages", label: "Messages", icon: '📫' },
    { href: "/member/change-password", label: "Change Password", icon: '🔑' }
]

export default function Sidebar(): React.ReactElement {
    const { isCollapsed, toggleCollapse } = useSidebarStore()
    const pathName = usePathname()

    return (
        <div 
            id="member-sidebar"
            className={cn(
                'flex flex-col bg-slate-800 text-white transition-width duration-300',
                isCollapsed ? 'w-16' : 'w-64'
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

            {/* Sidebar content */}
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
                        {isCollapsed ? item.icon : <span className="mr-4">{item.label}</span>}
                    </Link>
                ))}
            </nav>
        </div>
    )
}