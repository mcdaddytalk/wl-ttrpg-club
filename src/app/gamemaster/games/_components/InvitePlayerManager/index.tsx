"use client";

import { useDeleteInvite, useResendInvite } from "@/hooks/gamemaster/useGamemasterInvites";
import { toast } from "sonner";

import { useDataTable } from "@/hooks/use-data-table";
import { getColumns } from "./colums";
import { DataTableToolbar } from "@/components/DataTable/data-table-toolbar";
import { InvitePlayerModal } from "./InvitePlayerModal";
import { DataTable } from "@/components/DataTable/data-table";
import { InviteDO } from "@/lib/types/data-objects";
import { DataTableFilterField } from "@/lib/types/data-table";

interface InvitedPlayersManagerProps {
  gameId: string;
  invites: InviteDO[];
  onInviteUpdated: () => void;
}

export default function InvitedPlayersManager({ gameId, invites, onInviteUpdated }: InvitedPlayersManagerProps) {
  const { mutate: deleteInvite } = useDeleteInvite();
  const { mutate: resendInvite } = useResendInvite();

  const handleRevoke = (inviteId: string) => {
    deleteInvite(inviteId, {
      onSuccess: () => {
        toast.success("Invite revoked.");
        onInviteUpdated();
      },
      onError: () => toast.error("Failed to revoke invite."),
    });
  };

  const handleResend = (inviteId: string) => {
    resendInvite(inviteId, {
      onSuccess: () => toast.success("Invite resent."),
      onError: () => toast.error("Failed to resend invite."),
    });
  };

  const filterFields: DataTableFilterField<InviteDO>[] = [];
  
  const { table } = useDataTable<InviteDO>({
    data: invites,
    columns: getColumns({
      onRevoke:handleRevoke,
      onResend:handleResend,
    }),
    pageCount: 1,
    filterFields,
    enableAdvancedFilter: false,
    enableSorting: false,
    getRowId: (row) => row.id,
    shallow: false,
    clearOnDefault: true,
  });

  if (invites.length === 0) {
    return <div>No invites sent yet.</div>;
  }

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table}>
        <InvitePlayerModal gameId={gameId} onInviteSent={onInviteUpdated} />
      </DataTableToolbar>
      <DataTable table={table} />
    </div>
  );
}
