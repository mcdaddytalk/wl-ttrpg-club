import { sendEmail } from '@/utils/messaging';
import { renderEmail } from './renderEmail';
// React Email components
import SoftDeleteRequestedEmail from '@/emails/account/SoftDeleteRequestedEmail';
import AccountRestoredEmail from '@/emails/account/AccountRestoredEmail';
import PasswordChangedEmail from '@/emails/account/PasswordChangedEmail';
import ProviderLinkedEmail from '@/emails/account/ProviderLinkedEmail';
import ProviderUnlinkedEmail from '@/emails/account/ProviderUnlinkedEmail';
type Events =
  | { type: 'soft_delete_requested'; email: string, reason?: string }
  | { type: 'account_restored'; email: string }
  | { type: 'password_changed'; email: string }
  | { type: 'provider_linked'; email: string; provider: string }
  | { type: 'provider_unlinked'; email: string; provider: string };

export async function notifyAccountEvent(evt: Events) {
  switch (evt.type) {
    case 'soft_delete_requested': {
      const { html } = await renderEmail(SoftDeleteRequestedEmail, { memberEmail: evt.email, reason: evt.reason ?? undefined });
      return sendEmail({ to: evt.email, subject: '[WL-TTRPG] Account scheduled for deletion', body: html });
    }
    case 'account_restored': {
      const { html } = await renderEmail(AccountRestoredEmail, { memberEmail: evt.email });
      return sendEmail({ to: evt.email, subject: '[WL-TTRPG] Account restored', body: html });
    }
    case 'password_changed': {
      const { html } = await renderEmail(PasswordChangedEmail, { memberEmail: evt.email });
      return sendEmail({ to: evt.email, subject: '[WL-TTRPG] Password changed', body: html });
    }
    case 'provider_linked': {
      const { html } = await renderEmail(ProviderLinkedEmail,{ memberEmail: evt.email, provider: evt.provider });
      return sendEmail({ to: evt.email, subject: `[WL-TTRPG] ${evt.provider} linked`, body: html });
    }
    case 'provider_unlinked': {
      const { html } = await renderEmail(ProviderUnlinkedEmail, { memberEmail: evt.email, provider: evt.provider });
      return sendEmail({ to: evt.email, subject: `[WL-TTRPG] ${evt.provider} unlinked`, body: html });
    }
  }
}