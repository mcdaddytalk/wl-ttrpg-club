'use client'

import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyPendingInvites } from "@/hooks/member/useMyPendingInvites";
import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion"
import { useDebouncedCallback } from "@/hooks/use-debounce-cb";
import logger from "@/utils/logger";

export function PendingInvitesList() {
  const { data: invites, isLoading, refetch } = useMyPendingInvites();
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)
  const [declineModalInviteId, setDeclineModalInviteId] = useState<string | null>(null)
  
  const debouncedRefetch = useDebouncedCallback(() => {
    refetch()
  }, 200)

  if (isLoading) {
    return <Skeleton className="h-32 w-full" />
  }

  if (!invites || invites.length === 0) {
    return <p className="text-muted-foreground">You have no pending invites.</p>
  }

  const handleAccept = async (inviteId: string) => {
    try {
      setActionLoadingId(inviteId)
      const response = await fetch(`/api/invites/${inviteId}/accept`, {
        method: 'PATCH',
      })
      if (!response.ok) throw new Error('Failed to accept invite')
      toast.success('Invite accepted!')
      debouncedRefetch()
    } catch (error) {
      logger.error('Error accepting invite:', error)
      toast.error('Error accepting invite')
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleDeclineConfirmed = async (inviteId: string) => {
    try {
      setActionLoadingId(inviteId)
      const response = await fetch(`/api/members/invites/${inviteId}/decline`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to decline invite')
      toast.success('Invite declined')
      debouncedRefetch()
    } catch (error) {
      logger.error('Error declining invite:', error)
      toast.error('Error declining invite')
    } finally {
        setActionLoadingId(null)
        setDeclineModalInviteId(null)
    }
  }

  return (
    <>
      <AnimatePresence>
        {invites.map((invite) => (
          <motion.div
            key={invite.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="border rounded-md p-4 space-y-2"
          >
            <div className="font-semibold">{invite.game_title}</div>
            <div className="text-sm text-muted-foreground">
              Invited by {invite.gm_name} on {invite.invited_at ? new Date(invite.invited_at).toLocaleDateString() : "Unknown"}
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                onClick={() => handleAccept(invite.id)}
                disabled={actionLoadingId === invite.id}
              >
                {actionLoadingId === invite.id ? 'Accepting...' : 'Accept'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeclineModalInviteId(invite.id)}
                disabled={actionLoadingId === invite.id}
              >
                {actionLoadingId === invite.id ? 'Declining...' : 'Decline'}
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <ConfirmationModal
        title="Decline Invite"
        description="Are you sure you want to decline this game invitation? This action cannot be undone."
        isOpen={!!declineModalInviteId}
        onCancel={() => setDeclineModalInviteId(null)}
        onConfirm={() => {
          if (declineModalInviteId) {
            handleDeclineConfirmed(declineModalInviteId)
          }
        }}
      />
    </>
  )
}
