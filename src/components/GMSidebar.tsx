"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { useGMSidebarStore } from "@/store/gmSidebarStore"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

const navItems = [
    { href: "/gamemaster/games", label: "My Games", icon: '👤' },
    { href: "/gamemaster/locations", label: "My Locations", icon: '📍' },
]

export default function GMSidebar(): React.ReactElement {
    const { isCollapsed, toggleCollapse } = useGMSidebarStore()
    const pathname = usePathname();

    return (
        <div
            id="gm-sidebar"
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

            {/* Navigation */}
            <nav id="sidebar-nav" className="flex-1 overflow-y-auto">
                <ul className="p-2">
                    {navItems.map((item) => (
                        <Tooltip key={item.href}>
                            <TooltipTrigger asChild>
                                <li className="my-2">
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            'flex items-center rounded-md p-2 text-sm font-medium hover:bg-slate-700',
                                            item.href === pathname ? 'bg-slate-700' : ''
                                        )}
                                    >
                                        <span className="mr-2">{item.icon}</span>
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            </TooltipTrigger>
                            <TooltipContent>{item.label}</TooltipContent>
                        </Tooltip>
                    ))}
                </ul>
            </nav>
        </div>
    )
}