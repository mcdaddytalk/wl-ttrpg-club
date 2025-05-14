import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/utils/supabase/server"

interface Params {
  id: string; 
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<Params> }
): Promise<NextResponse> {
  if (request.method !== "PATCH") {
    return NextResponse.json({ message: "Method not allowed" }, { status: 405 })
  }

  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { id: messageId } = await params

  const { error } = await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("id", messageId)
    .eq("recipient_id", user.id)

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: "Message marked as read" })
}
