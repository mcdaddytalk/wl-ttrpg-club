'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAccountSummary } from '@/hooks/member/useAccountSummary';
import { Provider, PROVIDER_ALL } from '@/lib/types/custom';
import { signInWithProvider } from '@/server/authActions';
import { getURL } from '@/utils/helpers';
import { useState } from 'react';

export default function ConnectedAccountsCard() {
  const { summaryQuery: { data }, isLastMethod, unlinkProvider } = useAccountSummary();
  const { mutate: unlink, isPending } = unlinkProvider;
  const [linking, setLinking] = useState<Provider | null>(null);

  const linkedProviders = new Set((data?.providers ?? []).map((p: any) => p.provider));
  const unlinked = PROVIDER_ALL.filter((p) => !linkedProviders.has(p));

  return (
    <Card>
      <CardHeader><CardTitle>Connected Accounts</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {(data?.providers ?? []).map((p: any) => (
          <div key={p.id} className="flex items-center justify-between rounded-md border p-2">
            <div className="text-sm">{p.provider}</div>
            <Button 
                variant="outline"
                disabled={isLastMethod || isPending}
                onClick={() => unlink(p.id)}
            >
              {isPending ? 'Unlinking...' : 'Unlink'}
            </Button>
          </div>
        ))}

        <div className="flex flex-wrap gap-2 pt-2">
          {unlinked.map((p) => (
            <Button
              key={p}
              variant="secondary"
              disabled={linking == p}
              onClick={async () => {
                try {
                    setLinking(p);
                    await signInWithProvider(p, {
                        postLoginRedirect: '/member/account',
                        redirectTo: getURL('/auth/callback'), // optional override
                        force: true, // if you want to force re-consent / account picker
                    });
                } finally {
                    setLinking(null);
                }
              }}
            >
              {linking === p ? 'Linking…' : `Link ${p.charAt(0).toUpperCase() + p.slice(1)}`}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}