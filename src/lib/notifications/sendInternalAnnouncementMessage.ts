import { createSupabaseServerClient } from '@/utils/supabase/server';
import { CreateMessage, SupabaseRecipientListResponse } from '@/lib/types/custom';
import { AnnouncementDO } from '../types/data-objects';

export async function sendInternalAnnouncementMessage(announcement: AnnouncementDO) {
  const supabase = await createSupabaseServerClient();

  const { data: recipients, error: recipientError } = await supabase.rpc('get_announcement_recipients', {
    audience: announcement.audience
  }) as unknown as SupabaseRecipientListResponse;

  if (recipientError || !recipients?.length) return;

  const messages: CreateMessage[] = recipients
    .filter((m) => m.consent === true)
    .map((m) => ({
      sender_id: announcement.author_id,
      recipient_id: m.id,
      subject: announcement.title,
      content: announcement.body,
      category: 'announcement',
      link_url: '/member/announcements',
    }));

  if (!messages.length) return;

  const { error: messageError } = await supabase
    .from('messages')
    .insert(messages);

  if (messageError) throw messageError;
}