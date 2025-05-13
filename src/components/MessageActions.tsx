'use client'

import { useState } from "react"
import MessageModal from "@/components/modals/MessageModal"
import { ContactListDO, MessageDO } from "@/lib/types/data-objects"
import { Button } from "@/components/ui/button"
import { Reply, Forward, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { ConfirmationModal } from "@/components/modals/ConfirmationModal"

interface MessageActionProps {
    senderId?: string
    message: MessageDO
    members: ContactListDO[]
    userId: string
}   

export function MessageActions({
  senderId,
  message,
  members,
  userId,
}: MessageActionProps) {
    const router = useRouter();
    const [mode, setMode] = useState<'reply' | 'forward'>('reply')
    const [openModal, setOpenModal] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
  

    const handleDelete = async () => {
        const res = await fetch(`/api/messages/${message.id}`, { method: "DELETE" })
        if (res.ok) {
          router.push("/member/messages")
        } else {
          console.error("Failed to delete message")
        }
    }

    return (
        <>
          <div className="flex gap-4">
            <Button size="sm" onClick={() => { setMode("reply"); setOpenModal(true) }}>
              <Reply className="w-4 h-4 mr-1" /> Reply
            </Button>
            <Button size="sm" variant="outline" onClick={() => { setMode("forward"); setOpenModal(true) }}>
              <Forward className="w-4 h-4 mr-1" /> Forward
            </Button>
            <Button size="sm" variant="destructive" onClick={() => setConfirmOpen(true)}>
              <Trash2 className="w-4 h-4 mr-1" /> Delete
            </Button>
          </div>
    
          <MessageModal
            isOpen={openModal}
            onCancel={() => setOpenModal(false)}
            onConfirm={() => setOpenModal(false)}
            members={members}
            user={{ id: userId } as any}
            mode={mode}
            message={message}
            fixedRecipient={mode === "reply" && senderId ? senderId : ""}
            useFixedRecipient={mode === "reply" && !!senderId}
          />
    
          <ConfirmationModal
            title="Delete Message"
            description="Are you sure you want to permanently delete this message? This action cannot be undone."
            isOpen={confirmOpen}
            onCancel={() => setConfirmOpen(false)}
            onConfirm={handleDelete}
          />
        </>
      )
    }
