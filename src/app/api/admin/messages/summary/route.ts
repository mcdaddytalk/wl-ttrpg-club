import { createSupabaseServerClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (request.method !== 'GET') {
          return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }
  
  const supabase = await createSupabaseServerClient();
  
  const { data, count } = await supabase
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
      content,
      subject,
      created_at
    `, { count: 'exact' })
    .eq('category', 'support')
    .eq('is_read', false)
    .order('created_at', { ascending: false })
    .limit(1);

  const profile = data?.[0]?.sender?.profiles;
  const sender_display_name = [
    profile?.given_name,
    profile?.surname,
  ].filter(Boolean).join(" ");
  
  return NextResponse.json({
    unreadCount: count ?? 0,
    latestMessageSnippet: data?.[0]?.content?.slice(0, 60) ?? 'No recent message',
    latestSender: sender_display_name ?? 'Unknown',
    latestReceivedAt: data?.[0]?.created_at ?? new Date(0).toISOString(),
  });

}