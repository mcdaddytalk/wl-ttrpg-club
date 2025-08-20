import * as React from 'react';
import EmailLayout from '../_components/EmailLayout';
import { CardHeader, CardBody } from '../_components/Card';
import { capitalize } from '@/utils/helpers';

export default function ProviderLinkedEmail({ memberEmail, provider }: { memberEmail: string; provider: string }) {
  return (
    <EmailLayout preview={`Linked ${capitalize(provider)} as a sign-in method`}>
      <CardHeader>New sign-in method linked</CardHeader>
      <CardBody>
        <p>Hi {memberEmail},</p>
        <p>You linked <b>{capitalize(provider)}</b> as a sign-in method.</p>
        <p className="text-xs text-slate-400 mt-4">If this wasn’t you, please unlink and contact support.</p>
      </CardBody>
    </EmailLayout>
  );
}