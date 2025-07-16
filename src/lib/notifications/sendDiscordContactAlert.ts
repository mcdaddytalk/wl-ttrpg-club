import { ENVS } from '@/utils/constants/envs';
import { getURL } from '@/utils/helpers';
import { ContactCategory } from '../types/custom';

interface SendDiscordContactAlertOptions {
  id: string;
  name: string;
  email: string;
  category: ContactCategory;
  message: string;
}

const MODERATOR_ROLE_ID = '1361143300756603041'; // replace with real role ID

const webhookMap: Record<SendDiscordContactAlertOptions['category'], string> = {
    general: ENVS.DISCORD_WEBHOOK_CONTACT, // General
    'bug report': ENVS.DISCORD_WEBHOOK_CONTACT, //ENVS.DISCORD_WEBHOOK_BUG_REPORT,
    'feature request': ENVS.DISCORD_WEBHOOK_CONTACT, //ENVS.DISCORD_WEBHOOK_FEATURE_REQUEST,
    'new contact': ENVS.DISCORD_WEBHOOK_CONTACT,
    support: ENVS.DISCORD_WEBHOOK_SUPPORT,
    feedback: ENVS.DISCORD_WEBHOOK_CONTACT, //ENVS.DISCORD_WEBHOOK_FEEDBACK,
    question: ENVS.DISCORD_WEBHOOK_CONTACT, //NVS.DISCORD_WEBHOOK_QUESTION,
    other: ENVS.DISCORD_WEBHOOK_CONTACT, //ENVS.DISCORD_WEBHOOK_OTHER,
};

export async function sendDiscordContactAlert({
  id,
  name,
  email,
  category,
  message,
}: SendDiscordContactAlertOptions) {
  const webhook = webhookMap[category];
  if (!webhook) throw new Error(`Missing webhook for category: ${category}`);

  const adminLink = getURL(`/admin/contact-submissions#${id}`);

  const content = `<@&${MODERATOR_ROLE_ID}>`;

  const payload = {
    content,
    username: 'ContactBot',
    embeds: [
      {
        title: `📨 New Contact Message: ${category.toUpperCase()}`,
        color: 0x5865f2,
        fields: [
          {
            name: '👤 From',
            value: `**${name}**\n<${email}>`,
            inline: true,
          },
          {
            name: '📂 Category',
            value: `\`${category}\``,
            inline: true,
          },
          {
            name: '💬 Message Preview',
            value: message.length > 300 ? message.slice(0, 300) + '...' : message,
          },
          {
            name: '🔗 View in Admin',
            value: `[Open Submission](${adminLink})`,
          },
        ],
        footer: {
          text: 'WL-TTRPG Contact Form',
        },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}
