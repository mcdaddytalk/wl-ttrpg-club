import { createSupabaseServerClient } from '@/utils/supabase/server';
import { CreateMessage } from '@/lib/types/custom';
import { AnnouncementDO } from '../types/data-objects';

export async function sendInternalAnnouncementMessage(announcement: AnnouncementDO) {
  const supabase = await createSupabaseServerClient();

  const { data: recipients, error: recipientError } = await supabase.rpc('get_announcement_recipients', {
    audience: announcement.audience
  });

  if (recipientError || !recipients?.length) return;

  const messages: CreateMessage[] = recipients
    .filter((m: any) => m.consent === true)
    .map((member: any) => ({
      sender_id: announcement.author_id,
      recipient_id: member.id,
      subject: announcement.title,
      content: announcement.body,
      category: 'announcement',
      link_url: '/member/announcements',
    }));

  if (!messages.length) return;

  const { error: messageError } = await supabase.from('messages').insert(messages);
  if (messageError) throw messageError;
}