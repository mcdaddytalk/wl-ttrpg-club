'use client'

import { Skeleton } from "@/components/ui/skeleton"
import { useMyProfileSummary } from "@/hooks/member/useMyProfileSummary"
import UserAvatar from '@/components/UserAvatar';
import Link from "next/link"
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useSession from "@/utils/supabase/use-session";
import { formatDate } from "@/utils/helpers";
import { Role } from "@/lib/types/custom";
import { RoleBadgeGroup } from "@/components/RoleBadgeGroup";

export function ProfileSummary() {
  const { data: profile, isLoading } = useMyProfileSummary()
  const session = useSession();

  if (isLoading) {
    return (
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2 w-full">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
    )
  }

  if (!profile) {
    return <p className="text-muted-foreground">Unable to load profile.</p>
  }

  const displayName = `${profile.given_name} ${profile.surname}`
  const roles = (session?.user.user_metadata.roles || ['Member']) as Role[]

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-3 gap-4"
    >
      {/* Avatar (upper left quadrant) */}
      <div className="row-span-2 flex items-start">
      {profile.avatar ? (
        <UserAvatar
          avatarUrl={profile.avatar}
          fullName={displayName}
          size={16}
        />
      ) : (
        <div className="h-18 w-18 rounded-full bg-muted" />
      )}
      </div>

      <div className="col-span-2 space-y-1">
        <div className="font-semibold text-lg leading-tight">
          {profile.given_name} {profile.surname}
        </div>
        <div className="flex gap-2 flex-wrap text-sm">
          <Badge variant="outline" className="capitalize">
            {profile.experience_level || "unspecified"}
          </Badge>
        </div>        
      </div>

      <div className="col-span-3 space-y-2 pt-2">
        {profile.created_at && (
          <span className="text-muted-foreground">
            Member Since: {formatDate(profile.created_at, { formatStr: "MMM YYYY" })}
          </span>
        )}
        <div className="flex flex-wrap gap-2">
          <RoleBadgeGroup roles={roles} />
        </div>
        {profile.bio && (
          <p className="text-sm text-muted-foreground line-clamp-2">{profile.bio}</p>
        )}
        <Button size="sm" variant="secondary" asChild>
          <Link href="/member/profile">Edit Profile</Link>
        </Button>
      </div>
    </motion.div>
  )
}
