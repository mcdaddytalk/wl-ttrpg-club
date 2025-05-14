'use client'

import { useMyRecentMessages } from "@/hooks/member/useMyRecentMessages"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Mail } from "lucide-react"
import { formatRelativeDate } from "@/utils/helpers" // Optional helper, or just use toLocaleDateString
import { AnimatePresence, motion } from "framer-motion"

export function MessagesPreview() {
  const { data: messages, isLoading } = useMyRecentMessages()

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    )
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="border rounded-md p-6 text-center space-y-4 flex flex-col items-center">
        <Mail className="w-12 h-12 text-muted-foreground" />
        <p className="text-muted-foreground">No new messages.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      <AnimatePresence>
  {messages.slice(0, 3).map((message) => (
        <motion.div
        key={message.id}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        >
            <Link key={message.id} href={`/member/messages/${message.id}`} className="block">
            <div className="group border rounded-md p-4 hover:bg-muted transition space-y-1">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold group-hover:underline text-base line-clamp-1">
                        {message.subject || "No Subject"}
                    </h3>
                    {!message.is_read && (
                        <span className="ml-2 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                            Unread
                        </span>
                    )}
                </div>
                {message.preview && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {message.preview}
                    </p>
                )}
                {message.created_at && (
                    <div className="text-xs text-muted-foreground mt-1">
                        {formatRelativeDate(message.created_at)}
                    </div>
                )}
            </div>
            </Link>
        </motion.div>
      ))}
      </AnimatePresence>
    </div>
  )
}
