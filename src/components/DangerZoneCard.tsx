'use client';

import { useState } from 'react';
import fetcher from '@/utils/fetcher';
import { toast } from 'sonner';

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAccountSummary } from '@/hooks/member/useAccountSummary';
import { useMutation } from '@tanstack/react-query';
import { ConfirmationModal } from '@/components/modals/ConfirmationModal';

export default function DangerZoneCard() {
  const { summaryQuery: { data } } = useAccountSummary();
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [password, setPassword] = useState("");
  const hasPassword = !!data?.hasPassword;

  const softDelete = useMutation({
    mutationFn: (body: { reason?: string; currentPassword?: string }) =>
      fetcher("/api/members/account/soft-delete", {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    onSuccess: async () => {
      toast.success("Account scheduled for deletion. You can restore within 30 days.");
      setOpen(false);
      setTyped("");
      setPassword("");
      // optional signout+redirect:
      // const supabase = createClientComponentClient();
      // await supabase.auth.signOut();
      // router.replace('/goodbye');
    },
    onError: (e: unknown) => {
      const message = e instanceof Error ? e.message : "Failed to schedule deletion";
      toast.error(message);
    },
  });

  const restore = useMutation({
    mutationFn: () => fetcher("/api/members/account/restore", { method: "PATCH" }),
    onSuccess: () => toast.success("Account restored"),
    onError: (e: unknown) => {
      const message = e instanceof Error ? e.message : "Failed to restore account";
      toast.error(message)
    }
  });

  const confirmDisabled = typed !== "DELETE" || (hasPassword && password.length === 0);

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle>Danger Zone</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>
          Status: <span className="font-medium">{data?.member?.status}</span>
        </p>
        <p>
          Soft‑delete deactivates your account now. After <b>30 days</b> it will be permanently deleted.
          You can restore anytime before then by signing in.
        </p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Soft‑delete account
        </Button>
        {data?.member?.status === "soft_deleted" && (
          <Button variant="secondary" onClick={() => restore.mutate()}>
            Restore account
          </Button>
        )}
      </CardFooter>

      <ConfirmationModal
        title="Confirm account deletion"
        description="Type DELETE to confirm. If you have a password, re-enter it."
        isOpen={open}
        onCancel={() => {
          setOpen(false);
          setTyped("");
          setPassword("");
        }}
        onConfirm={() =>
          softDelete.mutate({
            currentPassword: hasPassword ? password : undefined,
          })
        }
        confirmLabel="Delete my account"
        confirmDisabled={confirmDisabled}
        isLoading={softDelete.isPending}
      >
        <div>
          <label className="text-sm">Type DELETE</label>
          <Input value={typed} onChange={(e) => setTyped(e.target.value)} />
        </div>

        {hasPassword && (
          <div>
            <label className="text-sm">Password</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        )}
      </ConfirmationModal>
    </Card>
  );
}