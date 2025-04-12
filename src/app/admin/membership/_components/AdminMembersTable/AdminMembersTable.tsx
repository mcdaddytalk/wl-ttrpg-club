import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable/data-table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useSession from "@/utils/supabase/use-session";
import { User } from "@supabase/supabase-js";
import { useState } from "react";
import { DataTableFilterField, MemberDO } from "@/lib/types/custom";
import { ManageRolesModal } from "@/components/Modal/ManageRolesModal";
import { getColumns } from "./columns";
import { 
    useQuery,
    // useSuspenseQuery,
} from "@tanstack/react-query";
import { redirect, useRouter } from "next/navigation";
import { ConfirmationModal } from "@/components/Modal/ConfirmationModal";
import { AddMemberModal } from "@/components/Modal/AddMemberModal";
import { 
    fetchRoles 
} from "@/queries/fetchMembers";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTableToolbar } from "@/components/DataTable/data-table-toolbar";
import { usePaginatedMembers } from "@/hooks/usePaginatedMembers";
import { DataTableSkeleton } from "@/components/DataTable/data-table-skeleton";
import { useSendPasswordReset } from "@/hooks/useSendPasswordReset";
import { useRemoveMember } from "@/hooks/useRemoveMember";

interface AdminMembersTableProps {
    className?: string
}
 
const AdminMembersTable = ({ className }: AdminMembersTableProps): React.ReactElement => {
    const session = useSession();
    const router = useRouter();
    const user: User = (session?.user as User) ?? null;
    const { mutate: sendResetPasswordEmail } = useSendPasswordReset();
    const { mutate: removeMember } = useRemoveMember();
        
    const { data: membersData, isLoading: isLoadingMembers, isError: errorMembers } = usePaginatedMembers();
    const { data: allRoles, isLoading: isLoadingRoles, isError: errorRoles } = useQuery(fetchRoles());

    const members: MemberDO[] = membersData?.members ?? [];
    const pageCount = membersData?.pageCount ?? 1;

    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [isAddMemberModalOpen, setAddMemberModalOpen] = useState(false);
    const [isRemoveMemberModalOpen, setRemoveMemberModalOpen] = useState(false);
    const [isManageRolesModalOpen, setManageRolesModalOpen] = useState(false);
    const [isPasswordResetModalOpen, setPasswordResetModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<MemberDO | null>(null);
    
    const enhancedMembers = members?.map((member) => ({
        ...member,
    })) || [];

    const openModal = (modal: string, member?: MemberDO) => {
        if (member) setSelectedMember(member);
        if (modal === 'addMember') setAddMemberModalOpen(true);
        if (modal === 'removeMember') setRemoveMemberModalOpen(true);
        if (modal === 'manageRoles') setManageRolesModalOpen(true);
        if (modal === 'passwordReset') setPasswordResetModalOpen(true);
        setActiveModal(modal);
    }
    const closeModal = () => {
        if (activeModal === 'addMember') setAddMemberModalOpen(false);
        if (activeModal === 'removeMember') setRemoveMemberModalOpen(false);
        if (activeModal === 'manageRoles') setManageRolesModalOpen(false);
        if (activeModal === 'passwordReset') setPasswordResetModalOpen(false);
        setActiveModal(null);
    }
        
    const handleAddMemberConfirm = () => {
        closeModal();
    };

    const handleRemoveMemberConfirm = (id: string) => {
        removeMember(
            { userId: id, adminId: user.id },
            {
                onSuccess: () => {
                    toast.success("Member removed successfully!");
                },
                onError: () => {
                    toast.error("Failed to remove member.");
                }
            }
        );
        closeModal()
    }

    const handlePasswordResetConfirm = (email: string) => {
        sendResetPasswordEmail(
            { email },
            {
                onSuccess: () => {
                    toast.success("Password reset email sent successfully!");
                },
                onError: () => {
                    toast.error("Failed to send password reset email.");
                }
            }
        );
        closeModal();
    }

    const filterFields: DataTableFilterField<MemberDO>[] = [
        {
            id: "email",
            label: "Email",
            placeholder: "Sort by Email"
        },
        {
            id: "isAdmin",
            label: "Is Admin?",
            placeholder: "Filter by Admin",
            options: [
                { value: "true", label: "Yes" },
                { value: "false", label: "No" }
            ]            
        },
        {
            id: "isMinor",
            label: "Is Minor?",
            placeholder: "Filter by Minor",
            options: [
                { value: "true", label: "Yes" },
                { value: "false", label: "No" }
            ]            
        },
        {
            id: "status",
            label: "Status",
            placeholder: "Filter by Status",
            options: [
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
              { value: "pending", label: "Pending" },
              { value: "banned", label: "Banned" }
            ]
          }          
    ]
    
    const { table } = useDataTable({
        data: enhancedMembers,
        columns: getColumns({ onOpenModal: openModal, router }),
        pageCount: pageCount || -1,
        filterFields,
        enableAdvancedFilter: false,
        initialState: {
            pagination: {
                pageIndex: 0,
                pageSize: 5
            },
            sorting: [
                { id: "created_at", desc: true }
            ],
            columnPinning: {
                right: ["onManageRoles", "onResetPassword", "onRemoveMember"]
            }
        },
        getRowId: (originalRow) => originalRow.id,
        shallow: false,
        clearOnDefault: true,
    })

    
    
    if (errorMembers || errorRoles) {
        redirect("/error");
    }

    return (
        <section>
            <Card className={className}>
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Members</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center mb-4">
                        <Button 
                            className="bg-green-400 hover:bg-green-600 text-slate-700 rounded-md px-4 py-2"
                            disabled={isLoadingMembers || isLoadingRoles}
                            onClick={() => openModal("addMember")}
                        >
                            Add Member
                        </Button>
                    </div>
                    {isLoadingMembers || isLoadingRoles ? (
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
            {/* Add Member Modal */}
            {activeModal === "addMember" && (
                <AddMemberModal 
                    isOpen={isAddMemberModalOpen}
                    onConfirm={handleAddMemberConfirm}
                    onCancel={closeModal}
                />
            )}
            
            {/* ResetPassword Modal */}
            {activeModal === "resetPassword" && selectedMember && (
                <ConfirmationModal
                    title={"Reset Password"}
                    description={`Are you sure you want to reset the password for ${selectedMember.email}?`}
                    isOpen={isPasswordResetModalOpen}
                    onConfirm={() => handlePasswordResetConfirm(selectedMember.email)}
                    onCancel={() => closeModal()}
                />
            )}
            {/* Remove Member Modal */}
            {activeModal === "removeMember" && selectedMember && (
                <ConfirmationModal
                    title={"Remove Member"}
                    description={`Are you sure you want to remove ${selectedMember.given_name} ${selectedMember.surname} [${selectedMember.email}]?`}
                    isOpen={isRemoveMemberModalOpen}
                    onConfirm={() => handleRemoveMemberConfirm(selectedMember.id)}
                    onCancel={() => closeModal()}
                />
            )}
            {/* Manage Roles Modal */}
            {activeModal === "manageRoles" && selectedMember && (
                <ManageRolesModal
                    member={selectedMember}
                    allRoles={allRoles || []}
                    isOpen={isManageRolesModalOpen}
                    onCancel={() => closeModal()}
                />
            )}
        </section>
    
    )
}

export default AdminMembersTable;