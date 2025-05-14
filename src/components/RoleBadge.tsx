'use client'

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { User, Crown, ScrollText, BadgeHelp } from "lucide-react"
import { motion } from "framer-motion"

export interface RoleBadgeProps {
    role: string
    description?: string
    icon?: React.ReactNode
    index?: number // for staggered animation if needed
}

const defaultRoleStyles: Record<string, string> = {
    admin: 'bg-red-100 text-red-700 border border-red-300',
    gamemaster: 'bg-purple-100 text-purple-700 border border-purple-300',
    member: 'bg-green-100 text-green-700 border border-green-300',
    default: 'bg-muted text-muted-foreground',
  }
  
  const defaultRoleIcons: Record<string, React.ReactNode> = {
    admin: <Crown className="w-3.5 h-3.5 mr-1" />,
    gamemaster: <ScrollText className="w-3.5 h-3.5 mr-1" />,
    member: <User className="w-3.5 h-3.5 mr-1" />,
  }
  
  const defaultDescriptions: Record<string, string> = {
    admin: "Platform administrator with full permissions",
    gamemaster: "Can run games and manage content",
    member: "Standard player account",
  }
  
  export function RoleBadge({ role, description, icon, index = 0 }: RoleBadgeProps) {
    const lowerRole = role.toLowerCase()
    const badgeStyle = defaultRoleStyles[lowerRole] || defaultRoleStyles.default
    const roleIcon = icon ?? defaultRoleIcons[lowerRole] ?? <BadgeHelp className="w-3.5 h-3.5 mr-1" />
    const tooltip = description ?? defaultDescriptions[lowerRole] ?? `Custom role: ${role}`
  
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05, duration: 0.2 }}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge className={cn("capitalize inline-flex items-center", badgeStyle)}>
              {roleIcon}
              {role}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
      </motion.div>
    )
  }
