"use client";

import { useDataTable } from "@/hooks/use-data-table";
import { AdminNoteDO } from "@/lib/types/data-objects";
import { DataTableFilterField } from "@/lib/types/data-table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable/data-table";
import { DataTableSkeleton } from "@/components/DataTable/data-table-skeleton";
import { DataTableToolbar } from "@/components/DataTable/data-table-toolbar";
import { useAdminNotes, useDeleteAdminNote } from "@/hooks/admin/useAdminNotes";
import { getColumns } from "./columns";
import { useState } from "react";
import { AdminNotePreviewModal } from "@/components/modals/AdminNotePreviewModal";
import { toast } from "sonner";
import { AdminNoteForm } from "../AdminNoteForm";

export default function AdminNotesDashboard() {
    const { data: notes, isLoading } = useAdminNotes();
    const { mutate: removeNote } = useDeleteAdminNote();
    const [viewingNote, setViewingNote] = useState<AdminNoteDO | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [editingNote, setEditingNote] = useState<AdminNoteDO | null>(null);


    const handleViewNote = (note: AdminNoteDO) => {
        setViewingNote(note);
        setPreviewOpen(true);
    };

    const handleDeleteNote = async (id: string) => {
        removeNote(id, {
            onSuccess: () => {
                toast.success("Note deleted");
                setPreviewOpen(false);
            },
        });
    };

    const pageSize = 10;
    const pageCount = Math.ceil((notes?.length || 0) / pageSize);

    const filterFields: DataTableFilterField<AdminNoteDO>[] = [
        {
            id: "note",
            label: "Note Content",
            placeholder: "Search note text...",
        },
        {
            id: "target_type",
            label: "Target Type",
            options: [
                { label: "Member", value: "member" },
                { label: "Game", value: "game" },
            ],
        },
        {
            id: "author_email",
            label: "Author Email",
            placeholder: "Filter by author email",
        },
    ];

    const enrichedNotes = (notes ?? []).map((n) => ({
        ...n,
        onView: handleViewNote,
    }));

    const { table } = useDataTable<AdminNoteDO>({
        data: enrichedNotes || [],
        columns: getColumns(),
        pageCount: pageCount || -1,
        filterFields,
        enableAdvancedFilter: false,
        initialState: {
        pagination: { pageIndex: 0, pageSize },
        sorting: [{ id: "created_at", desc: true }],
        },
        getRowId: (row) => row.id,
        clearOnDefault: true,
        shallow: false,
    });

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className='text-2xl bold'>{editingNote ? "Edit Note" : "Create New Note"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <AdminNoteForm
                        note={editingNote}
                        onSaved={() => {
                            setEditingNote(null);
                        }}
                    />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Admin Notes</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                    <DataTableSkeleton
                        rowCount={5}
                        columnCount={5}
                        filterableColumnCount={2}
                        searchableColumnCount={1}
                        cellWidths={["10rem", "10rem", "30rem", "10rem"]}
                        shrinkZero
                    />
                    ) : (
                    <DataTable table={table}>
                        <DataTableToolbar table={table} filterFields={filterFields} />
                    </DataTable>
                    )}
                    <AdminNotePreviewModal
                        isOpen={previewOpen}
                        onClose={() => setPreviewOpen(false)}
                        note={viewingNote}
                        onDelete={handleDeleteNote}
                        onEdit={(note) => {
                            setEditingNote(note);
                            setPreviewOpen(false);
                        }}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
