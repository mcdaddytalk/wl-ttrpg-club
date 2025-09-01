"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { usePaginatedInvites } from "@/hooks/usePaginatedInvites";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/DataTable/data-table";
import { DataTableSkeleton } from "@/components/DataTable/data-table-skeleton";
import { DataTableToolbar } from "@/components/DataTable/data-table-toolbar";
import { getColumns } from "./columns";
import { useState } from "react";
import { InviteDO } from "@/lib/types/data-objects";
import { DataTableFilterField } from "@/lib/types/data-table";
import { useResendInvite, useCancelInvite } from "@/hooks/admin/useAdminInvites";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";

export const AdminInvitationsTable = () => {
  const { data, isLoading, isError } = usePaginatedInvites();
  const invites = data?.invites ?? [];
  const pageCount = data?.pageCount ?? 1;

  const { mutate: resendInvite } = useResendInvite();
  const { mutate: cancelInvite } = useCancelInvite();

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedInvite, setSelectedInvite] = useState<InviteDO | null>(null);

  const openModal = (modal: string, invite?: InviteDO) => {
    setSelectedInvite(invite || null);
    setActiveModal(modal);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedInvite(null);
  };

  const filterFields: DataTableFilterField<InviteDO>[] = [
    {
      id: "status",
      label: "Status",
      options: [
        { value: "accepted", label: "Accepted" },
        { value: "pending", label: "Pending" },
        { value: "expired", label: "Expired" },
      ],
    },
    {
      id: "notified",
      label: "Notified",
      options: [
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ],
    },
  ];

  const { table } = useDataTable({
    data: invites,
    columns: getColumns({ onOpenModal: openModal }),
    pageCount,
    filterFields,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
      sorting: [{ id: "invited_at", desc: true }],
      columnPinning: {
        right: ["actions"],
      },
    },
    getRowId: (row) => row.id,
  });

  if (isLoading) {
    return <DataTableSkeleton rowCount={10} columnCount={6} />;
  }

  if (isError) {
    return <div className="text-red-500">Failed to load invitations.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invitations</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable table={table}>
          <DataTableToolbar table={table} filterFields={filterFields} />
        </DataTable>
        {activeModal === "resend" && selectedInvite && (
            <ConfirmationModal
                title="Resend Invite"
                description={`Resend invite to ${selectedInvite.display_name} (${selectedInvite.email || "N/A"})?`}
                isOpen={true}
                onConfirm={() => {
                resendInvite(selectedInvite.id, {
                    onSuccess: () => {
                    toast.success("Invite resent.");
                    closeModal();
                    },
                    onError: () => {
                    toast.error("Failed to resend invite.");
                    },
                });
                }}
                onCancel={closeModal}
            />
            )}

        {activeModal === "cancel" && selectedInvite && (
        <ConfirmationModal
            title="Cancel Invite"
            description={`Cancel invite for ${selectedInvite.display_name}? This cannot be undone.`}
            isOpen={true}
            onConfirm={() => {
            cancelInvite(selectedInvite.id, {
                onSuccess: () => {
                toast.success("Invite canceled.");
                closeModal();
                },
                onError: () => {
                toast.error("Failed to cancel invite.");
                },
            });
            }}
            onCancel={closeModal}
        />
        )}
      </CardContent>
    </Card>
  );
};