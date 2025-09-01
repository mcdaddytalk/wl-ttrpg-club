import { SERVER_ENVS as ENVS } from "@/utils/constants/envs"
import { getURL } from '@/utils/helpers';

type Common = { memberEmail: string, reason?: string };
type Provider = 'google' | 'discord' | string;

const baseStyles = {
  wrap: 'font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,"Apple Color Emoji","Segoe UI Emoji"; background:#0f172a; margin:0; padding:24px;',
  card: 'max-width:560px;margin:0 auto;background:#0b1220;border:1px solid #1e293b;border-radius:16px;overflow:hidden',
  header: 'padding:16px 20px;background:#111827;color:#e5e7eb;font-weight:700;font-size:16px',
  body: 'padding:20px;color:#cbd5e1;font-size:14px;line-height:1.6',
  btn: 'display:inline-block;background:#22c55e;color:#0b1220;text-decoration:none;border-radius:10px;padding:10px 14px;font-weight:700',
  meta: 'margin-top:18px;color:#94a3b8;font-size:12px',
};

const brand = {
  name: ENVS.BRAND_NAME,
  from: ENVS.BRAND_EMAIL,
  supportEmail: ENVS.SUPPORT_EMAIL,
};

const emailFooter = () =>
  `<p style="${baseStyles.meta}">
    If you didn’t request this, please contact ${brand.supportEmail}.
  </p>`;

export function softDeleteRequestedEmail({ memberEmail, reason }: Common) {
  const restoreUrl = getURL('/member/account?restore=1');
  const subject = `[${brand.name}] Account scheduled for deletion (30‑day window)`;
  const html = `
  <div style="${baseStyles.wrap}">
    <div style="${baseStyles.card}">
      <div style="${baseStyles.header}">Account scheduled for deletion</div>
      <div style="${baseStyles.body}">
        <p>Hi ${memberEmail},</p>
        <p>Your account has been <strong>deactivated (soft‑deleted)</strong>. It will be permanently removed after <strong>30 days</strong>.</p>
        <p>Reason: ${reason}</p>
        <p>You can restore your account any time before then:</p>
        <p><a style="${baseStyles.btn}" href="${restoreUrl}">Restore account</a></p>
        ${emailFooter()}
      </div>
    </div>
  </div>`;
  return { subject, html };
}

export function accountRestoredEmail({ memberEmail }: Common) {
  const subject = `[${brand.name}] Your account has been restored`;
  const html = `
  <div style="${baseStyles.wrap}">
    <div style="${baseStyles.card}">
      <div style="${baseStyles.header}">Account restored</div>
      <div style="${baseStyles.body}">
        <p>Hi ${memberEmail},</p>
        <p>Your account has been <strong>restored</strong>. You now have full access again.</p>
        ${emailFooter()}
      </div>
    </div>
  </div>`;
  return { subject, html };
}

export function passwordChangedEmail({ memberEmail }: Common) {
  const subject = `[${brand.name}] Your password was changed`;
  const html = `
  <div style="${baseStyles.wrap}">
    <div style="${baseStyles.card}">
      <div style="${baseStyles.header}">Password changed</div>
      <div style="${baseStyles.body}">
        <p>Hi ${memberEmail},</p>
        <p>Your password was changed successfully.</p>
        <p>If this wasn’t you, please <strong>reset your password immediately</strong> and contact support.</p>
        ${emailFooter()}
      </div>
    </div>
  </div>`;
  return { subject, html };
}

export function providerLinkedEmail({ memberEmail, provider }: Common & { provider: Provider }) {
  const subject = `[${brand.name}] ${capitalize(provider)} account linked`;
  const html = `
  <div style="${baseStyles.wrap}">
    <div style="${baseStyles.card}">
      <div style="${baseStyles.header}">New sign‑in method linked</div>
      <div style="${baseStyles.body}">
        <p>Hi ${memberEmail},</p>
        <p>You linked <strong>${capitalize(provider)}</strong> as a sign‑in method.</p>
        ${emailFooter()}
      </div>
    </div>
  </div>`;
  return { subject, html };
}

export function providerUnlinkedEmail({ memberEmail, provider }: Common & { provider: Provider }) {
  const subject = `[${brand.name}] ${capitalize(provider)} account unlinked`;
  const html = `
  <div style="${baseStyles.wrap}">
    <div style="${baseStyles.card}">
      <div style="${baseStyles.header}">Sign‑in method unlinked</div>
      <div style="${baseStyles.body}">
        <p>Hi ${memberEmail},</p>
        <p>You unlinked <strong>${capitalize(provider)}</strong> from your account.</p>
        ${emailFooter()}
      </div>
    </div>
  </div>`;
  return { subject, html };
}

function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}
