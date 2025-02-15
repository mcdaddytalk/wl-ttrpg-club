import { InviteData, DataTableFilterField } from "@/lib/types/custom";
import { DataTable } from "@/components/DataTable/data-table";
import { getColumns } from "./columns";
import { useDataTable } from "@/hooks/use-data-table";
import { useState } from "react";
import { DataTableToolbar } from "@/components/DataTable/data-table-toolbar";
import { ConfirmationModal } from "@/components/Modal/ConfirmationModal";
import { GMInviteModal } from "@/components/Modal/GMIniviteModal";
import { TodoModal } from "@/components/Modal/TodoModal";
import { Button } from "@/components/ui/button";


type GMInvitesCardProps = {
    invites: InviteData[];
    gamemasterId: string;
    onInviteAdded: () => void;
    onInviteEdit: () => void;
    onInviteDelete: (id: string) => void;
}

export default function GMInvitesCard({invites, gamemasterId, onInviteAdded, onInviteEdit, onInviteDelete}: GMInvitesCardProps): React.ReactElement {
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [selectedInvite, setSelectedInvite] = useState<InviteData | null>(null);
    const [isNewInviteModalOpen, setNewInviteModalOpen] = useState(false);
    const [isPurgeInviteModalOpen, setPurgeInviteModalOpen] = useState(false);
    const [isEditInviteModalOpen, setEditInviteModalOpen] = useState(false);
    const [isDeleteInviteModalOpen, setDeleteInviteModalOpen] = useState(false);

    const openModal = (modal: string, invite?: InviteData) => {
        if (invite) setSelectedInvite(invite);
        switch(modal) {
        case 'addNew':
            setNewInviteModalOpen(true);
            break;
        case 'purge':
            setPurgeInviteModalOpen(true);
            break;
        case 'edit':
            setEditInviteModalOpen(true);
            break;
        case 'delete':
            setDeleteInviteModalOpen(true);
            break;
        }
        setActiveModal(modal);
    }

    const closeModal = () => {
        switch(activeModal) {
        case 'addNew':
            setNewInviteModalOpen(false);
            break;
        case 'purge':
            setPurgeInviteModalOpen(false);
            break;
        case 'edit':
            setEditInviteModalOpen(false);
            break;
        case 'delete':
            setDeleteInviteModalOpen(false);
            break;
        }
        setActiveModal(null);
    }

    const handleRemoveInviteConfirm = () => {
        if (activeModal === 'purge') {
            invites.filter((invite) => invite.accepted === true).forEach((invite) => {
                onInviteDelete(invite.id);
            });
        } else {
            if (selectedInvite) 
                onInviteDelete(selectedInvite.id);
        }
        closeModal();
    }
    
    const pageSize = 5;
    const pageCount = Math.ceil(invites.length / pageSize);
    const filterFields: DataTableFilterField<InviteData>[] = [];
    
    const { table } = useDataTable({
        data: invites,
        columns: getColumns({ onOpenModal: openModal }),
        pageCount: pageCount || -1,
        filterFields,
        enableAdvancedFilter: false,
        initialState: {
        pagination: {
            pageIndex: 0,
            pageSize,
        },
        sorting: [],
        columnPinning: {
            right: ['actions']
        }
        },
        getRowId: (originalRow) => originalRow.id,
        shallow: true,
        clearOnDefault: true,
    })
    
    return (
        <div className="bg-white shadow-md rounded-lg p-4">
                <div className="flex flex-col gap-4 mb-4 border-b pb-4 border-slate-500">
                    {/* First Row - Game Invites (Left-Aligned) */}
                    <div className="self-start px-4 py-2">
                        <h3 className="text-2xl font-bold">Game Invites</h3>
                    </div>

                    {/* Second Row - Buttons (Left and Right) */}
                    <div className="flex justify-between w-full">
                        {/* Left-Aligned Button */}
                        <Button
                            onClick={() => openModal('addNew')}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Add New Invite
                        </Button>

                        {/* Right-Aligned Button */}
                        <Button
                            onClick={() => openModal('purge')}
                            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                        >
                            Purge Accepted Invites
                        </Button>
                    </div>
                </div>
                { invites && invites.length > 0
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
                        <span className="text-gray-500">No scheduled invites found.</span>
                        <br />
                        <span className="text-gray-500">Click the &ldquo;Add New Invite&rdquo; button to create a new invite.</span>
                    </div>
                )}
                { activeModal === 'addNew' && isNewInviteModalOpen && (
                    <GMInviteModal
                        isOpen={isNewInviteModalOpen}
                        onCancel={closeModal}
                        onConfirm={onInviteAdded}
                        gamemasterId={gamemasterId}
                        games={[]}
                        members={[]}
                    />
                )}
                { activeModal === 'purge' && isPurgeInviteModalOpen && (
                    <ConfirmationModal
                        isOpen={isPurgeInviteModalOpen}
                        onCancel={closeModal}
                        onConfirm={handleRemoveInviteConfirm}
                        title="Purge Invites"
                        description={`Are you sure you want to purge accepted invites?`}
                    />
                )}
                { activeModal === 'edit' && selectedInvite && isEditInviteModalOpen && (
                    <TodoModal
                        isOpen={isEditInviteModalOpen}
                        onCancel={closeModal}
                        onConfirm={onInviteEdit}
                        title="Add Edit Invite Modal"
                        description={`This would be a modal to Edit invite for "${selectedInvite.display_name}"`}
                    />
                )}
                { activeModal === 'delete' && selectedInvite && isDeleteInviteModalOpen && (
                    <ConfirmationModal
                        isOpen={isDeleteInviteModalOpen}
                        onCancel={closeModal}
                        onConfirm={handleRemoveInviteConfirm}
                        title="Delete Inite"
                        description={`Are you sure you want to delete this invite for "${selectedInvite.display_name}"?`}
                    />
                )}
        </div>
    )
}