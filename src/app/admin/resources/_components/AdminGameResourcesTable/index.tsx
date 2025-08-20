"use client";

import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/DataTable/data-table";
import { DataTableToolbar } from "@/components/DataTable/data-table-toolbar";
import { DataTableSkeleton } from "@/components/DataTable/data-table-skeleton";
import { RESOURCE_CATEGORIES } from "@/lib/types/custom";
import { getColumns } from "./columns";
import { DataTableFilterField } from "@/lib/types/data-table";
import { toSentenceCase } from "@/utils/helpers";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { GameResourcePreviewModal } from "@/components/modals/GameResourceModal";
import { useState } from "react";
import { GameResourceDO } from "@/lib/types/data-objects";
import { useAdminDeleteGameResource } from "@/hooks/admin/useAdminGameResources";

interface Props {
  data: GameResourceDO[];
  isLoading: boolean;
  onEdit: (resource: GameResourceDO) => void;
}

export default function AdminGameResourcesTable({ data, isLoading, onEdit }: Props) {
    const [resourceToDelete, setResourceToDelete] = useState<GameResourceDO | null>(null);
    const [previewing, setPreviewing] = useState<GameResourceDO | null>(null);

    const handleDelete = (resource: GameResourceDO) => setResourceToDelete(resource);
    const handlePreview = (resource: GameResourceDO) => setPreviewing(resource);
    
    const { mutate: deleteResource } = useAdminDeleteGameResource();
    const filterFields: DataTableFilterField<GameResourceDO>[] = [
        {
        id: "title",
        label: "Title",
        placeholder: "Search by Title",
        },
        {
        id: "category",
        label: "Category",
        placeholder: "Filter by Category",
        options: [
            ...RESOURCE_CATEGORIES.map((category) => ({ label: toSentenceCase(category), value: category }))    
        ],
        },
        {
        id: "visibility",
        label: "Visibility",
        placeholder: "Filter by Visibility",
        options: [
            { label: "Public", value: "public" },
            { label: "Members", value: "members" },
            { label: "Gamemasters", value: "gamemasters" },
            { label: "Admins", value: "admins" },
        ],
        },
    ];

    const { table } = useDataTable({
        data,
        columns: getColumns({ 
            onEdit,
            onDelete: handleDelete,
            onPreview: handlePreview,
        }),
        pageCount: 1,
        filterFields,
        enableAdvancedFilter: false,
        initialState: {
        pagination: { pageSize: 10, pageIndex: 0 },
        },
        getRowId: (row) => row.id,
        shallow: false,
        clearOnDefault: true,
    });

    return isLoading ? (
        <DataTableSkeleton
            rowCount={6}
            columnCount={6}
            searchableColumnCount={1}
            filterableColumnCount={2}
            cellWidths={["20rem", "8rem", "10rem", "12rem", "8rem"]}
            shrinkZero
        />
    ) : (
        <>
            <DataTable table={table}>
                <DataTableToolbar table={table} filterFields={filterFields} />
            </DataTable>
            {resourceToDelete && (
                <ConfirmationModal
                    isOpen={true}
                    title="Delete Resource"
                    description={`Are you sure you want to delete "${resourceToDelete.title}"?`}
                    onCancel={() => setResourceToDelete(null)}
                    onConfirm={() => {
                        deleteResource(resourceToDelete.id);
                        setResourceToDelete(null);
                    }}
                />
            )}
            <GameResourcePreviewModal
                resource={previewing}
                isOpen={!!previewing}
                onClose={() => setPreviewing(null)}
            />
        </>
    );
}
