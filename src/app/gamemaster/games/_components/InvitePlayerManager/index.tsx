"use client";

import { useDeleteInvite, useResendInvite } from "@/hooks/gamemaster/useGamemasterInvites";
import { toast } from "sonner";

import { useDataTable } from "@/hooks/use-data-table";
import { getColumns } from "./colums";
import { DataTableToolbar } from "@/components/DataTable/data-table-toolbar";
import { DataTable } from "@/components/DataTable/data-table";
import { GMGameDO, InviteDO } from "@/lib/types/data-objects";
import { DataTableFilterField } from "@/lib/types/data-table";
import { GMInviteModal } from "@/components/modals/GMIniviteModal";
import { useGameMembers } from "@/hooks/gamemaster/useGamemasterPlayers";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import logger from "@/utils/logger";

interface InvitedPlayersManagerProps {
  game: GMGameDO;
  invites: InviteDO[];
  onInviteUpdated: () => void;
}

export default function InvitedPlayersManager({ game, invites, onInviteUpdated }: InvitedPlayersManagerProps) {
  const { mutate: deleteInvite, isPending: isRevoking } = useDeleteInvite();
  const { mutate: resendInvite, isPending: isResending } = useResendInvite();
  const { members } = useGameMembers();  

  const [isInviteModalOpen, setInviteModalOpen] = useState(false);

  logger.debug("[GameInvite - Game]:  ", game);
  const gamemasterId = game.gamemaster.id;

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
      onSuccess: () => {
        toast.success("Invite resent.");
        onInviteUpdated();
    },    
      onError: () => toast.error("Failed to resend invite."),
    });
  };

  const closeModal = () => {
    setInviteModalOpen(false);
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
  
  return (
    <div className="gap-4 mb-4 border-b pb-4 border-slate-500">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full">
            <h2 className="text-2xl font-bold">Invited Players</h2>
            <Button
              onClick={() => setInviteModalOpen(true)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              disabled={isResending || isRevoking}
            >
              + Add New Invite
            </Button>
          </div>
      {invites.length > 0 
        ? (
          <>
            <DataTableToolbar table={table} />
            <DataTable table={table} />
          </>
        )
        : <div className="text-sm text-muted-foreground">No invites sent yet.</div>
      }
      <GMInviteModal
        isOpen={isInviteModalOpen}
        onCancel={closeModal}
        onConfirm={() => {
            onInviteUpdated()
            closeModal();
        }}
        gamemasterId={gamemasterId}
        games={[game]}
        members={members}
      />
    </div>
  );
}
