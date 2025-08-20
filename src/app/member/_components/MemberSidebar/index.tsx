"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { useSidebarStore } from "@/store/sidebarStore"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

type NavItem = { href: string; label: string; icon: string };

const navItems: NavItem[] = [
    { href: "/member", label: "Dashboard", icon: '🏠' },
    { href: "/member/account" , label: "Account", icon: '🔑' },
    { href: "/member/profile", label: "Profile", icon: '👤' },
    { href: "/member/my-games", label: "My Games", icon: '🎲' },
    { href: "/member/resources", label: "Resources", icon: '📚' },    
    { href: "/member/messages", label: "Messages", icon: '📫' },
    { href: "/member/my-invites", label: "Invites", icon: '🎉' },
]

export default function Sidebar(): React.ReactElement {
    const { isCollapsed, toggleCollapse } = useSidebarStore()
    const pathName = usePathname()

    const isActive = (href: string) =>
        pathName === href || pathName.startsWith(href + "/");

    return (
        <aside 
            id="member-sidebar"
            className={cn(
                'flex flex-col bg-slate-800 text-white transition-[width] duration-300',
                isCollapsed ? 'w-16' : 'w-44'
              )}
        >
            {/* Toggle button */}
            <Button
                aria-expanded={isCollapsed}
                aria-controls="sidebar-nav"
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                className="p-2 text-slate-400 hover:text-white"
                variant={'ghost'}
                onClick={toggleCollapse}
            >
                {isCollapsed ? 'Expand ➤' : 'Collapse ❮'}
            </Button>

            {/* Sidebar content */}
            <nav 
                id="sidebar-nav"
                aria-label="Member navigation"
                className="mt-4 space-y-2"
            >
                {navItems.map((item) => {
                    const active = isActive(item.href);

                    const linkClasses = cn(
                        "group flex items-center rounded-md px-3 py-2 text-sm font-medium leading-6",
                        active
                        ? "bg-slate-900 text-white"
                        : "text-slate-300 hover:bg-slate-700 hover:text-white"
                    );

                    if (isCollapsed) {
                        // Collapsed: icon-only with tooltip; add aria-label so SRs read the label
                        return (
                        <Tooltip delayDuration={0} key={item.href}>
                            <TooltipTrigger asChild>
                            <Link
                                href={item.href}
                                className={cn(linkClasses, "justify-center")}
                                aria-current={active ? "page" : undefined}
                                aria-label={item.label}
                                // prefetch={false} // optional if pages are heavy
                            >
                                <span aria-hidden="true">{item.icon}</span>
                                <span className="sr-only">{item.label}</span>
                            </Link>
                            </TooltipTrigger>
                            <TooltipContent sideOffset={5} side="right">
                            {item.label}
                            </TooltipContent>
                        </Tooltip>
                        );
                    }

                    // Expanded: icon + label
                    return (
                        <Link
                        key={item.href}
                        href={item.href}
                        className={linkClasses}
                        aria-current={active ? "page" : undefined}
                        // prefetch={false} // optional
                        >
                        <span className="mr-3" aria-hidden="true">
                            {item.icon}
                        </span>
                        <span>{item.label}</span>
                        </Link>
                    );
                    })}
                </nav>
                </aside>
    )
}