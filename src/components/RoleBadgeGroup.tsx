'use client'

import { Role } from "@/lib/types/custom"
import { RoleBadge, RoleBadgeProps } from "./RoleBadge"

export interface RoleBadgeGroupProps {
  roles: Role[]
  overrides?: Partial<Record<string, Omit<RoleBadgeProps, 'role' | 'index'>>>
  className?: string
}

const sortRoles = (roles: Role[]): Role[] => {
  const priority = { admin: 1, gamemaster: 2, member: 3 }
  return [...roles].sort((a, b) => (priority[a] ?? 99) - (priority[b] ?? 99))
}

export function RoleBadgeGroup({ roles, overrides = {}, className = "" }: RoleBadgeGroupProps) {
  const sorted = sortRoles(roles)

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {sorted.map((role, i) => (
        <RoleBadge
          key={role}
          role={role}
          index={i}
          {...(overrides[role.toLowerCase()] || {})}
        />
      ))}
    </div>
  )
}
