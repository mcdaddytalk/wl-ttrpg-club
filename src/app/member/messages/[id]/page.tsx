import { notFound } from "next/navigation"
import { createSupabaseServerClient } from "@/utils/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SupabaseMemberListResponse, SupabaseMessageResponse } from "@/lib/types/custom"
import { ContactListDO, MessageDO } from "@/lib/types/data-objects"
import { MessageActions } from "@/components/MessageActions"


interface MessageDetailPageProps {
    id: string
}

export default async function MessageDetailPage({ params }: { params: Promise<MessageDetailPageProps> }) {
    const { id } = await params
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    notFound()
  }

  const { data: messageData, error } = await supabase
    .from('messages')
    .select(`
        id,
        sender_id,
        recipient_id,
        sender:members!messages_sender_id_fkey (
            id,
            profiles (
                given_name,
                surname
            )
        ),
        recipient:members!messages_recipient_id_fkey (
            id,
            profiles (
                given_name,
                surname
            )
        ),
        subject,
        content,
        preview,
        category,
        link_url,
        is_read,
        is_archived,
        created_at
    `)
    .eq("id", id)
    .eq("recipient_id", user.id)
    .maybeSingle() as unknown as SupabaseMessageResponse

  if (error || !messageData) {
    return notFound()
  }

  // Mark as read if needed
  if (!messageData.is_read) {
    await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("id", messageData.id)
      .eq("recipient_id", user.id)
  }

  const message: MessageDO = {
    ...messageData,
    sender: {
        id: messageData.sender_id,
        given_name: messageData.sender.profiles.given_name ?? "",
        surname: messageData.sender.profiles.surname ?? ""
    },
    recipient: {
        id: messageData.recipient_id,
        given_name: messageData.recipient.profiles.given_name ?? "",
        surname: messageData.recipient.profiles.surname ?? ""
    }
  }

  // Fetch contacts for message modal
  const { data: contacts } = await supabase
    .from("members")
    .select(`
        id, 
        profiles (
            given_name, 
            surname
        )
    `) as unknown as SupabaseMemberListResponse;

  const members: ContactListDO[] = contacts?.map((contact) => ({
      id: contact.id,
      given_name: contact.profiles.given_name ?? "",
      surname: contact.profiles.surname ?? ""
  }))

  // Build sender ID
  const senderId = message.sender?.id

  return (
    <div className="p-4">
        <Button asChild variant="outline" size="sm">
            <Link href="/member/messages">← Back to Inbox</Link>
        </Button>
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="text-xl font-bold">
                    {message.subject || "(No Subject)"}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                    From: {message.sender.given_name} {message.sender.surname} — {format(new Date(message.created_at), "PPpp")}
                </div>
                <div className="prose max-w-none whitespace-pre-line">{message.content}</div>
                {message.link_url && (
                    <div className="pt-4">
                        <Button asChild variant="link" size="sm">
                            <Link href={message.link_url} target={message.link_url.startsWith("http") ? "_blank" : "_self"}>
                                View Related Link
                            </Link>
                        </Button>
                    </div>
                )}
                <div className="flex gap-4 pt-4">
                    <MessageActions
                        senderId={senderId}
                        message={message}
                        members={members}
                        userId={user.id}
                    />
                </div>
            </CardContent>
        </Card>
    </div>
  )
}
