import { DateCell } from "@/components/DataTable/data-table-cell-helpers";
import { Button } from "@/components/ui/button";
import { InviteDO } from "@/lib/types/data-objects";
import { ColumnDef } from "@tanstack/react-table";

interface ColumnOptions {
    onResend: (id: string) => void,
    onRevoke: (id: string) => void
}

export const getColumns = ({ onResend, onRevoke }: ColumnOptions): ColumnDef<InviteDO>[] => [
    {
        accessorKey: "display_name",
        header: "Name",
        cell: ({ row }) => <span>{row.original.display_name}</span>,
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => <span>{row.original.email}</span>,
      },
      {
        accessorKey: "invited_at",
        header: "Invited",
        cell: ({ row }) => <DateCell date={row.original.invited_at} label="Invited" />,
      },
      {
        accessorKey: "accepted_at",
        header: "Accepted",
        cell: ({ row }) => <DateCell date={row.original.accepted_at} label="Accepted" />,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => onResend(row.original.id)}>Resend</Button>
            <Button size="sm" variant="destructive" onClick={() => onRevoke(row.original.id)}>Revoke</Button>
          </div>
        ),
      },
];