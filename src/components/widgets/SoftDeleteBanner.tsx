"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import fetcher from "@/utils/fetcher";
import { useRouter } from "next/navigation";
import { useAccountSummary } from "@/hooks/member/useAccountSummary";

export default function SoftDeletedBanner() {
  const router = useRouter();
  const { summaryQuery: { data, refetch } } = useAccountSummary();
  const isSoftDeleted = data?.member?.status === "soft_deleted";

  const restore = useMutation({
    mutationFn: () => fetcher("/api/member/account/restore", { method: "PATCH" }),
    onSuccess: async () => {
      await refetch();
      router.refresh();
    },
  });

  if (!isSoftDeleted) return null;

  return (
    <Alert className="mb-4 border-amber-300 bg-amber-50">
      <AlertTitle>Account is deactivated</AlertTitle>
      <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span>
          Your account was soft‑deleted. It will be permanently removed after <b>30 days</b>.
          Restore now to regain full access.
        </span>
        <Button onClick={() => restore.mutate()} disabled={restore.isPending}>
          {restore.isPending ? "Restoring…" : "Restore account"}
        </Button>
      </AlertDescription>
    </Alert>
  );
}