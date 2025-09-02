"use client"

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdminLocationDO, ContactListDO } from "@/lib/types/data-objects";
import { DataTableFilterField } from "@/lib/types/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { getColumns } from "./columns";
import { DataTableSkeleton } from "@/components/DataTable/data-table-skeleton";
import { DataTableToolbar } from "@/components/DataTable/data-table-toolbar";
import { DataTable } from "@/components/DataTable/data-table";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { useRemoveLocation } from "@/hooks/useRemoveLocation";
import { AddLocationModal } from "@/components/modals/AddLocationModal";
import { EditLocationModal } from "@/components/modals/EditLocationModal";
import ManageLocationGMsModal from "@/components/modals/ManageLocationGMsModal";
import useSession from "@/utils/supabase/use-session";
import { User } from "@supabase/supabase-js";

const fetchGamemasters = async (): Promise<ContactListDO[]> => {
    const response = await fetch(`/api/admin/gamemasters`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  
    switch (response.status) {
      case 500:
        toast.error("Error fetching gamemasters");
        return [];   
      case 404:
        toast.error("Gamemasters not found");
        return [];
      case 200: {
        const gamemasters = await response.json();
        return gamemasters as ContactListDO[] || [];
      }
      default:
        toast.error("Error fetching gamemasters");
        return [];
    }
}
const fetchLocations = async (): Promise<AdminLocationDO[]> => {
    const response = await fetch(`/api/admin/locations`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  
    switch (response.status) {
      case 500:
        toast.error("Error fetching locations");
        return [];   
      case 404:
        toast.error("Locations not found");
        return [];
      case 200: {
        const locations = await response.json();
        return locations as AdminLocationDO[] || [];
      }
      default:
        toast.error("Error fetching locations");
        return [];
    }
  }


interface LocationsTableProps {
    className?: string;
}

const LocationsTable = ({ className }: LocationsTableProps): React.ReactElement => {
    const session = useSession();
    const user: User = (session?.user as User) ?? null;
    
    const { mutate: removeLocation } = useRemoveLocation();

    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [isAddLocationModalOpen, setAddLocationModalOpen] = useState(false);
    const [isEditLocationModalOpen, setEditLocationModalOpen] = useState(false);
    const [isManageGMsModalOpen, setManageGMsModalOpen] = useState(false);
    const [isRemoveLocationModalOpen, setRemoveLocationModalOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<AdminLocationDO | null>(null);

    const { data: locations, isLoading, isError } = useQuery<AdminLocationDO[], Error>({
        queryKey: ['locations', 'admin', 'full'],
        queryFn: () => fetchLocations(),
        enabled: true,
      });

    const { data: gamemasters, isLoading: isGamemastersLoading, isError: isGamemastersError } = useQuery<ContactListDO[], Error>({
        queryKey: ['gamemasters', 'admin', 'full'],
        queryFn: () => fetchGamemasters(),
        enabled: true,
      });

    const openModal = (modal: string, location?: AdminLocationDO) => {
        if (location) setSelectedLocation(location);
        if (modal === 'addLocation') setAddLocationModalOpen(true);
        if (modal === 'editLocation') setEditLocationModalOpen(true);
        if (modal === 'manageGMs') setManageGMsModalOpen(true);
        if (modal === 'removeLocation') setRemoveLocationModalOpen(true);
        setActiveModal(modal);
    }
    const closeModal = () => {
        if (activeModal === 'addLocation') setAddLocationModalOpen(false);
        if (activeModal === 'editLocation') setEditLocationModalOpen(false);
        if (activeModal === 'manageGMs') setManageGMsModalOpen(false);
        if (activeModal === 'removeLocation') setRemoveLocationModalOpen(false);
        setActiveModal(null);
    }

    const handleAddLocationConfirm = () => {
        closeModal();
    };
    const handleRemoveLocationConfirm = (id: string) => {
        removeLocation(
            { locationId: id, scope: 'admin' },
            {
                onSuccess: () => {
                    toast.success("Location removed successfully");
                },
                onError: () => {
                    toast.error("Failed to remove location");
                }
            }
        );
        closeModal();
    }
    
    const filterFields: DataTableFilterField<AdminLocationDO>[] = [];
    const pageSize = 5;
    const pageCount = Math.ceil((locations?.length || 0) / pageSize);

    const { table } = useDataTable<AdminLocationDO>({
        data: locations || [],
        columns: getColumns({ onOpenModal: openModal }),
        pageCount: pageCount || -1,
        filterFields,
        enableAdvancedFilter: false,
        initialState: {
            pagination: {
                pageSize,
                pageIndex: 0
            },
        },
        getRowId: (row) => row.id,
        shallow: false,
        clearOnDefault: true
    })

    if (isError || isGamemastersError) {
        redirect('/error');
    }

    return (
        <section>
            <Card className={className}>
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Locations</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center mb-4">
                        <Button
                            className="bg-green-400 hover:bg-green-600 text-slate-700 rounded-md px-4 py-2"
                            disabled={isLoading}
                            onClick={() => openModal("addLocation")}
                        >
                            Add Location
                        </Button>
                    </div>
                    {isLoading || isGamemastersLoading ? (
                        <DataTableSkeleton 
                            rowCount={6}
                            columnCount={7}
                            searchableColumnCount={3}
                            filterableColumnCount={5}
                            cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem", "8rem"]}
                            shrinkZero
                            />
                    ) : (
                        <DataTable
                            table={table}
                        >
                            <DataTableToolbar table={table} filterFields={filterFields}>
                                
                            </DataTableToolbar>
                        </DataTable>
                    )}
                </CardContent>
            </Card>
            {activeModal === 'addLocation' && (
                <AddLocationModal
                    isOpen={isAddLocationModalOpen}
                    gamemasters={gamemasters || []}
                    scope={'admin'}
                    userId={user.id}
                    onCancel={closeModal}
                    onConfirm={handleAddLocationConfirm}
                />
            )}
            {activeModal === 'editLocation' && selectedLocation && (
                <EditLocationModal
                    location={selectedLocation}
                    isOpen={isEditLocationModalOpen}
                    scope={'admin'}
                    onCancel={closeModal}
                    onConfirm={closeModal}
                />
            )}
            {activeModal === 'manageGMs' && selectedLocation && (
                <ManageLocationGMsModal
                    location={selectedLocation}
                    gamemasters={gamemasters || []}
                    userId={user.id}
                    isOpen={isManageGMsModalOpen}
                    onClose={closeModal}
                    onConfirm={closeModal}
                />
            )}
            {activeModal === 'removeLocation' && selectedLocation && (
                <ConfirmationModal
                    title={"Remove Location"}
                    description={`Are you sure you want to remove ${selectedLocation.name}?`}
                    isOpen={isRemoveLocationModalOpen}
                    onConfirm={() => handleRemoveLocationConfirm(selectedLocation.id)}
                    onCancel={() => closeModal()}
                />
            )}
        </section>
    );

}

export default LocationsTable;