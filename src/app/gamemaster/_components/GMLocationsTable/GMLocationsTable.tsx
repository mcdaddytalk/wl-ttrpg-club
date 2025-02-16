"use client"

import { toast } from "sonner";
import { GMLocationDO, DataTableFilterField } from "@/lib/types/custom";
import { useDataTable } from "@/hooks/use-data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { getColumns } from "./columns";
import { DataTableToolbar } from "@/components/DataTable/data-table-toolbar";
import { DataTable } from "@/components/DataTable/data-table";
import { ConfirmationModal } from "@/components/Modal/ConfirmationModal";
import { useRemoveLocation } from "@/hooks/useRemoveLocation";
import { AddLocationModal } from "@/components/Modal/AddLocationModal";
import { EditLocationModal } from "@/components/Modal/EditLocationModal";
import { User } from "@supabase/supabase-js";

interface LocationsTableProps {
    className?: string;
    locations: GMLocationDO[];
    gamemaster: User;
}

const LocationsTable = ({ className, locations, gamemaster }: LocationsTableProps): React.ReactElement => {
    const { mutate: removeLocation } = useRemoveLocation();

    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [isAddLocationModalOpen, setAddLocationModalOpen] = useState(false);
    const [isEditLocationModalOpen, setEditLocationModalOpen] = useState(false);
    const [isRemoveLocationModalOpen, setRemoveLocationModalOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<GMLocationDO | null>(null);

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
    const pageCount = (Math.ceil(locations.length / pageSize));

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
                            onClick={() => openModal("addLocation")}
                        >
                            Add Location
                        </Button>
                    </div>

                    { locations && locations.length > 0 
                    ? (
                        <DataTable
                            table={table}
                        >
                            <DataTableToolbar table={table} filterFields={filterFields}>
                            </DataTableToolbar>
                        </DataTable>
                    )
                    : (
                        <div className="text-center p-4">
                            <span className="text-gray-500">No locations found.</span>
                            <br />
                            <span className="text-gray-500">Click the &ldquo;Add New Invite&rdquo; button to create a new location.</span>
                        </div>
                    )}
                </CardContent>
            </Card>
            {activeModal === 'addLocation' && (
                <AddLocationModal
                    isOpen={isAddLocationModalOpen}
                    gamemasters={[{ id: gamemaster.id, given_name: gamemaster.user_metadata.given_name, surname: gamemaster.user_metadata.surname }]}
                    userId={gamemaster.id}
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