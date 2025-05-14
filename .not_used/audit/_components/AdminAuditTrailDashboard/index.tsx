"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable/data-table";
import { DataTableSkeleton } from "@/components/DataTable/data-table-skeleton";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTableFilterField } from "@/lib/types/data-table";
import { AuditTrailDO } from "@/lib/types/data-objects";
import { useAuditTrail } from "@/hooks/admin/useAuditTrail";
import { getColumns } from "./columns";
import { useState } from "react";
import { AuditTrailDetailsModal } from "../AdminAuditDetailModal";

export default function AdminAuditTrailDashboard() {
  const { data = [], isLoading } = useAuditTrail();
  const [selectedAudit, setSelectedAudit] = useState<AuditTrailDO | null>(null);

  const handlePreview = (record: AuditTrailDO) => {
    setSelectedAudit(record);
  };

  const filterFields: DataTableFilterField<AuditTrailDO>[] = [
    {
      id: "action",
      label: "Action",
      placeholder: "Filter by action",
      options: [
        { label: "Create", value: "create" },
        { label: "Update", value: "update" },
        { label: "Delete", value: "delete" },
        { label: "Login", value: "login" },
        { label: "System", value: "system" },
      ],
    },
    {
      id: "target_type",
      label: "Target Type",
      placeholder: "Filter by target type",
    },
  ];

  const { table } = useDataTable<AuditTrailDO>({
    data,
    columns: getColumns({ onPreview: handlePreview }),
    pageCount: 1,
    filterFields,
    enableAdvancedFilter: false,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
      sorting: [{ id: "created_at", desc: true }],
    },
    getRowId: (row) => row.id,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Trail</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <DataTableSkeleton
            rowCount={5}
            columnCount={6}
            filterableColumnCount={2}
            searchableColumnCount={0}
            shrinkZero
          />
        ) : (
          <DataTable table={table} />
        )}
        {selectedAudit && (
          <AuditTrailDetailsModal
            isOpen={!!selectedAudit}
            metadata={selectedAudit?.metadata ?? {}}
            onClose={() => setSelectedAudit(null)}
          />
        )}
      </CardContent>
    </Card>
  );
}
