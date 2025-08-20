import * as React from 'react';
import EmailLayout from '../_components/EmailLayout';
import { CardHeader, CardBody } from '../_components/Card';

export default function PasswordChangedEmail({ memberEmail }: { memberEmail: string }) {
  return (
    <EmailLayout preview="Your password was changed">
      <CardHeader>Password changed</CardHeader>
      <CardBody>
        <p>Hi {memberEmail},</p>
        <p>Your password was changed successfully.</p>
        <p>If this wasn’t you, please reset your password immediately and contact support.</p>
        <p className="text-xs text-slate-400 mt-4">Security notice</p>
      </CardBody>
    </EmailLayout>
  );
}