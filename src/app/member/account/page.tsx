'use client';

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAccountSummary } from '@/hooks/member/useAccountSummary';
import { useState } from 'react';
import { toast } from 'sonner';
import SoftDeletedBanner from '@/components/widgets/SoftDeleteBanner';

export default function AccountPage() {
  const { summaryQuery: { isLoading, data }, changePassword, unlinkProvider: unlink } = useAccountSummary();
  const [pw, setPw] = useState({ current: '', next: '' });

  if (isLoading) return <div className="p-6">Loading…</div>;
  if (!data) return <div className="p-6">Error loading account data.</div>;

  const { member, hasPassword, providers } = data;

  return (
    <div className="space-y-6 p-4 max-w-3xl">
      <SoftDeletedBanner />
      {/* Sign-in & Security */}
      <Card>
        <CardHeader>
          <CardTitle>Sign‑in & Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm text-muted-foreground">Password</div>
            <div className="mt-2 grid gap-2">
              {hasPassword ? (
                <>
                  <Label htmlFor="current">Current password</Label>
                  <Input id="current" type="password" value={pw.current} onChange={e => setPw(v => ({ ...v, current: e.target.value }))} />
                </>
              ) : (
                <div className="text-sm">You don’t have a password yet. Set one below.</div>
              )}
              <Label htmlFor="next">New password</Label>
              <Input id="next" type="password" value={pw.next} onChange={e => setPw(v => ({ ...v, next: e.target.value }))} />
            </div>
          </div>

          <Button
            onClick={async () => {
              try {
                await changePassword.mutateAsync({ currentPassword: hasPassword ? pw.current : undefined, newPassword: pw.next });
                toast.success('Password updated');
                setPw({ current: '', next: '' });
              } catch (e:any) {
                toast.error(e?.message ?? 'Failed to update password');
              }
            }}
          >
            {hasPassword ? 'Change password' : 'Set password'}
          </Button>
        </CardContent>
      </Card>

      {/* Connected Accounts */}
      <Card>
        <CardHeader><CardTitle>Connected Accounts</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {providers.map((p: any) => (
            <div key={p.id} className="flex items-center justify-between rounded-md border p-2">
              <div className="text-sm">{p.provider}</div>
              <Button variant="outline" onClick={() => unlink.mutate(p.id)}>Unlink</Button>
            </div>
          ))}
          {/* Add “Link” buttons client-side with supabase.auth.signInWithOAuth({ provider }) */}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader><CardTitle>Danger Zone</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm">
            Status: <span className="font-medium">{member.status}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Soft‑delete moves your account to a recoverable state before permanent deletion.
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button variant="destructive">Soft‑delete account</Button>
          <Button variant="secondary">Restore account</Button>
        </CardFooter>
      </Card>
    </div>
  );
}