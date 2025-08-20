import * as React from 'react';
import EmailLayout from '../_components/EmailLayout';
import { CardHeader, CardBody } from '../_components/Card';
import { capitalize } from '@/utils/helpers';

export default function ProviderUnlinkedEmail({ memberEmail, provider }: { memberEmail: string; provider: string }) {
  return (
    <EmailLayout preview={`Unlinked ${capitalize(provider)} from your account`}>
      <CardHeader>Sign-in method unlinked</CardHeader>
      <CardBody>
        <p>Hi {memberEmail},</p>
        <p>You unlinked <b>{capitalize(provider)}</b> from your account.</p>
        <p className="text-xs text-slate-400 mt-4">If this wasn’t you, please relink and contact support.</p>
      </CardBody>
    </EmailLayout>
  );
}