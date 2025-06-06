"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { useSidebarStore } from "@/store/sidebarStore"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

const navItems = [
    { href: "/member", label: "Dashboard", icon: '🏠' },
    { href: "/member/profile", label: "Profile", icon: '👤' },
    { href: "/member/change-password", label: "Change Password", icon: '🔑' },
    { href: "/member/my-games", label: "My Games", icon: '🎲' },
    { href: "/member/resources", label: "Resources", icon: '📚' },    
    { href: "/member/messages", label: "Messages", icon: '📫' },
    { href: "/member/my-invites", label: "Invites", icon: '🎉' },
]

export default function Sidebar(): React.ReactElement {
    const { isCollapsed, toggleCollapse } = useSidebarStore()
    const pathName = usePathname()

    return (
        <div 
            id="member-sidebar"
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