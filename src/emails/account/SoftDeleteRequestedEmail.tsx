import * as React from 'react';
import EmailLayout from '../_components/EmailLayout';
import { CardHeader, CardBody, EmailButton } from '../_components/Card';
import { getURL } from '@/utils/helpers';

export type SoftDeleteRequestedProps = {
  memberEmail: string;
};

export default function SoftDeleteRequestedEmail({ memberEmail }: SoftDeleteRequestedProps) {
  const restoreUrl = getURL('/member/account?restore=1');

  return (
    <EmailLayout preview="Account scheduled for deletion — restore within 30 days">
      <CardHeader>Account scheduled for deletion</CardHeader>
      <CardBody>
        <p>Hi {memberEmail},</p>
        <p>
          Your account has been <b>deactivated (soft-deleted)</b>. It will be permanently removed after <b>30 days</b>.
        </p>
        <p>You can restore your account any time before then:</p>
        <p><EmailButton href={restoreUrl}>Restore account</EmailButton></p>
        <p className="text-xs text-slate-400 mt-4">
          If you didn’t request this, please contact support.
        </p>
      </CardBody>
    </EmailLayout>
  );
}