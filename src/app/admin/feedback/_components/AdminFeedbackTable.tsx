"use client";

import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/DataTable/data-table";
import { DataTableToolbar } from "@/components/DataTable/data-table-toolbar";
import { DataTableSkeleton } from "@/components/DataTable/data-table-skeleton";
import { FEEDBACK_CATEGORIES, FeedbackDO } from "@/lib/types/custom";
import { getColumns } from "./columns";
import { DataTableFilterField } from "@/lib/types/custom";
import { toSentenceCase } from "@/lib/utils";
import FeedbackPreviewModal from "./FeedbackPreviewModal";
import { useHandleFeedback } from "@/hooks/admin/useAdminFeedback";
import { useState } from "react";

interface AdminFeedbackTableProps {
  data: FeedbackDO[];
  isLoading: boolean;
  isError: boolean;
}

export default function AdminFeedbackTable({ data, isLoading }: AdminFeedbackTableProps) {
    const [selectedFeedback, setSelectedFeedback] = useState<FeedbackDO | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const { mutate: handleFeedback } = useHandleFeedback();

    const onPreview = (feedback: FeedbackDO) => {
    setSelectedFeedback(feedback);
    setModalOpen(true);
    };

    const onHandle = () => {
        if (!selectedFeedback) return;
        handleFeedback(selectedFeedback.id, {
            onSuccess: () => {
            setModalOpen(false);
            },
        });
    };
  const filterFields: DataTableFilterField<FeedbackDO>[] = [
    {
      id: "category",
      label: "Category",
      placeholder: "Filter by Category",
      options: [
        ...FEEDBACK_CATEGORIES.map((category) => ({ label: toSentenceCase(category), value: category }))
      ],
    },
    {
      id: "handled",
      label: "Handled?",
      placeholder: "Filter by Status",
      options: [
        { label: "Yes", value: "true" },
        { label: "No", value: "false" }
      ],
    }
  ];

  const { table } = useDataTable<FeedbackDO>({
    data,
    columns: getColumns({ onPreview}),
    pageCount: 1,
    filterFields,
    enableAdvancedFilter: false,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10
      },
      sorting: [
        { id: "submitted_at", desc: true }
      ]
    },
    getRowId: (row) => row.id,
    shallow: false,
    clearOnDefault: true
  });

  if (isLoading) {
    return (
      <DataTableSkeleton
        rowCount={6}
        columnCount={6}
        searchableColumnCount={1}
        filterableColumnCount={2}
        cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem", "8rem"]}
        shrinkZero
      />
    );
  }

  return (
    <>
        <DataTable table={table}>
        <DataTableToolbar table={table} filterFields={filterFields} />
        </DataTable>
        <FeedbackPreviewModal
            feedback={selectedFeedback}
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            onHandle={onHandle}
        />
    </>
  );
}
