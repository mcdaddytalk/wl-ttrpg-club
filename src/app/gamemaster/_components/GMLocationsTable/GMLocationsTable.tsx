"use client"

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { GMLocationDO, DataTableFilterField } from "@/lib/types/custom";
import { useDataTable } from "@/hooks/use-data-table";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { getColumns } from "./columns";
import { DataTableSkeleton } from "@/components/DataTable/data-table-skeleton";
import { DataTableToolbar } from "@/components/DataTable/data-table-toolbar";
import { DataTable } from "@/components/DataTable/data-table";
import { ConfirmationModal } from "@/components/Modal/ConfirmationModal";
import { useRemoveLocation } from "@/hooks/useRemoveLocation";
import { AddLocationModal } from "@/components/Modal/AddLocationModal";
import { EditLocationModal } from "@/components/Modal/EditLocationModal";
import useSession from "@/utils/supabase/use-session";
import { User } from "@supabase/supabase-js";

const fetchLocations = async (gm_id: string): Promise<GMLocationDO[]> => {
    const response = await fetch(`/api/gamemaster/${gm_id}/locations`,
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
      case 200:
        const locations = await response.json();
        return locations as GMLocationDO[] || [];
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
    const [isRemoveLocationModalOpen, setRemoveLocationModalOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<GMLocationDO | null>(null);

    const { data: locations, isLoading, isError } = useQuery<GMLocationDO[], Error>({
        queryKey: ['locations', 'gm', 'full', user?.id],
        queryFn: () => fetchLocations(user?.id as string),
        enabled: !!user,
      });
    
    const openModal = (modal: string, location?: GMLocationDO) => {
        if (location) setSelectedLocation(location);
        if (modal === 'addLocation') setAddLocationModalOpen(true);
        if (modal === 'editLocation') setEditLocationModalOpen(true);
        if (modal === 'removeLocation') setRemoveLocationModalOpen(true);
        setActiveModal(modal);
    }
    const closeModal = () => {
        if (activeModal === 'addLocation') setAddLocationModalOpen(false);
        if (activeModal === 'editLocation') setEditLocationModalOpen(false);
        if (activeModal === 'removeLocation') setRemoveLocationModalOpen(false);
        setActiveModal(null);
    }

    const handleAddLocationConfirm = () => {
        closeModal();
    };
    const handleRemoveLocationConfirm = (id: string) => {
        removeLocation(
            { locationId: id, scope: 'gm' },
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
    
    const filterFields: DataTableFilterField<GMLocationDO>[] = [];
    const pageSize = 5;
    const pageCount = (Math.ceil(locations?.length || 0 / pageSize));

    const { table } = useDataTable<GMLocationDO>({
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

    if (isError) {
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
                    {isLoading ? (
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
                    gamemasters={[{ id: user.id, given_name: user.user_metadata.given_name, surname: user.user_metadata.surname }]}
                    userId={user.id}
                    scope={'gm'}
                    onCancel={closeModal}
                    onConfirm={handleAddLocationConfirm}
                />
            )}
            {activeModal === 'editLocation' && selectedLocation && (
                <EditLocationModal
                    location={selectedLocation}
                    isOpen={isEditLocationModalOpen}
                    scope="gm"
                    onCancel={closeModal}
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