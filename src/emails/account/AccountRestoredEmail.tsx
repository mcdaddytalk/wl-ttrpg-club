import * as React from 'react';
import EmailLayout from '../_components/EmailLayout';
import { CardHeader, CardBody } from '../_components/Card';

export default function AccountRestoredEmail({ memberEmail }: { memberEmail: string }) {
  return (
    <EmailLayout preview="Your WL-TTRPG account has been restored">
      <CardHeader>Account restored</CardHeader>
      <CardBody>
        <p>Hi {memberEmail},</p>
        <p>Your account has been <b>restored</b>. You now have full access again.</p>
        <p className="text-xs text-slate-400 mt-4">If this wasn’t you, please contact support.</p>
      </CardBody>
    </EmailLayout>
  );
}