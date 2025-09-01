"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable/data-table";
import { DataTableSkeleton } from "@/components/DataTable/data-table-skeleton";
import { DataTableToolbar } from "@/components/DataTable/data-table-toolbar";
import { usePaginatedGames } from "@/hooks/usePaginatedGames";
import { useDataTable } from "@/hooks/use-data-table";
import { getColumns } from "./columns";
import { useState } from "react";
import { ArchiveGameModal } from "../AdminArchiveGameModal";
import { AssignGamemasterModal } from "../AssignGamemasterModal";
import { AdminGameDetailsModal } from "../AdminGameDetailModal";
import { GMGameDataDO } from "@/lib/types/data-objects";
import { DataTableFilterField } from "@/lib/types/data-table";

export const AdminGamesTable = () => {
  const { data, isLoading, isError } = usePaginatedGames();

  const games = data?.games ?? [];
  const pageCount = data?.pageCount ?? 1;

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<GMGameDataDO | null>(null);

  const openModal = (modal: string, game?: GMGameDataDO) => {
    setSelectedGame(game || null);
    setActiveModal(modal);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedGame(null);
  };

  const filterFields: DataTableFilterField<GMGameDataDO>[] = [
    { id: "status", label: "Status", options: [] },
    { id: "gm_name", label: "Gamemaster", options: [] },
    { id: "archived", label: "Show Archived?", options: [
      { value: "true", label: "Yes" },
      { value: "false", label: "No" },
    ]},
  ];

  const { table, globalFilter, setGlobalFilter } = useDataTable<GMGameDataDO>({
    data: games,
    columns: getColumns({ onOpenModal: openModal }),
    pageCount,
    filterFields,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10
      },
      sorting: [{ id: "created_at", desc: true }],
      columnPinning: {
        right: ["actions"]
      }
    },
    getRowId: (row) => row.id
  });

  if (isLoading) {
    return (
      <DataTableSkeleton
        rowCount={8}
        columnCount={7}
        searchableColumnCount={2}
        filterableColumnCount={4}
      />
    );
  }

  if (isError) {
    return <div className="text-red-500">Failed to load games.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Games</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable table={table}>
          <DataTableToolbar 
            table={table} 
            filterFields={filterFields} 
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        </DataTable>
        {activeModal === "archiveGame" && selectedGame && (
            <ArchiveGameModal
                isOpen={activeModal === "archiveGame"}
                onClose={closeModal}
                game={selectedGame}
            />
        )}
        {activeModal === "assignGM" && selectedGame && (
            <AssignGamemasterModal
                isOpen={activeModal === "assignGM"}
                onClose={closeModal}
                game={selectedGame}
            />
        )}
        {activeModal === "viewGame" && (
          <AdminGameDetailsModal
            isOpen={activeModal === "viewGame"}
            onClose={closeModal}
            game={selectedGame}
          />
        )}
      </CardContent>
    </Card>
  )
}