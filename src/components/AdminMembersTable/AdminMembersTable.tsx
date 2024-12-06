import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable } from "./DataTable";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useSession from "@/utils/supabase/use-session";
import { User } from "@supabase/supabase-js";
import { useState } from "react";
import { MemberData } from "@/lib/types/custom";
import { ManageRolesModal } from "../ManageRolesModal";
import { columns } from "./columns";
import { 
    useQuery,
    // useSuspenseQuery,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { ConfirmationModal } from "../ConfirmationModal";
import { AddMemberModal } from "../AddMemberModal";
import { fetchMembersFull, fetchRoles } from "@/queries/fetchMembers";

interface AdminMembersTableProps {
    className?: string
}
 
const AdminMembersTable = ({ className }: AdminMembersTableProps): React.ReactElement => {
    const session = useSession();
    const user: User = (session?.user as User) ?? null;
    
    const { data: members, isLoading: isLoadingMembers, isError: errorMembers } = useQuery(fetchMembersFull());
    const { data: allRoles, isLoading: isLoadingRoles, isError: errorRoles } = useQuery(fetchRoles());

    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [isManageRolesModalOpen, setManageRolesModalOpen] = useState(false);
    const [isAddMemberModalOpen, setAddMemberModalOpen] = useState(false);
    const [confirmModalAction, setConfirmModalAction] = useState<(() => void) | null>(null);
    const [confirmModalTitle, setConfirmModalTitle] = useState("");
    const [confirmModalDescription, setConfirmModalDescription] = useState("");
    const [selectedMember, setSelectedMember] = useState<MemberData | null>(null);

    const confirmAction = (action: () => void, title: string, description: string) => {
        setConfirmModalAction(() => action);
        setConfirmModalTitle(title);
        setConfirmModalDescription(description);
        setConfirmModalOpen(true);
    };

    const handleModalConfirm = () => {
        if (confirmModalAction) {
            confirmModalAction();
        }
        setConfirmModalOpen(false);
    }

    const handleAddMemberConfirm = () => {
        setAddMemberModalOpen(false);
    };

    const handleManageRoles = (member: MemberData) => {
        setSelectedMember(member);
        setManageRolesModalOpen(true);
    };

    const enhancedMembers = (members as unknown as MemberData[])?.map((member) => ({
        ...member,
        onManageRoles: handleManageRoles,
        onResetPassword: (email: string) => {
            confirmAction(async () => {
                try {
                    const response = await fetch("/api/admin/reset-password", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ email }),
                    });

                    if (!response.ok) {
                        throw new Error("Failed to reset password");
                    }
                    toast.success("Password reset email sent!");
                } catch (error) {
                    console.error("Error resetting password:", error);
                    toast.error("Failed to reset password");                    
                }
            }, "Reset Password", `Are you sure you want to reset the password for ${email}?`);
        },
        onRemoveMember: (id: string, displayName: string) => {
            confirmAction(async () => {
                try {
                    const response = await fetch("/api/admin/remove-member", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ memberId: id, deletedBy: user.id }),
                    });

                    if (!response.ok) {
                        throw new Error("Failed to remove member");
                    }
                    toast.success("Member removed successfully!");
                } catch (error) {
                    console.error("Error removing member:", error);
                    toast.error("Failed to remove member");                    
                }
            }, "Remove Member", `Are you sure you want to remove ${displayName} [${id}]?`);
        }
    }));
    
    if (errorMembers || errorRoles) {
        redirect("/error");
    }

    if (isLoadingMembers || isLoadingRoles) return <div>Loading...</div>;

    
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
                            onClick={() => {
                                toast.success("Open Add Member Modal");
                                setAddMemberModalOpen(true);
                            }}
                        >
                            Add Member
                        </Button>
                    </div>
                    <DataTable<MemberData, unknown> 
                        data={enhancedMembers} 
                        columns={columns} 
                    />
                </CardContent>
            </Card>
            {/* Add Member Modal */}
            <AddMemberModal 
                isOpen={isAddMemberModalOpen}
                onConfirm={handleAddMemberConfirm}
                onCancel={() => setAddMemberModalOpen(false)} 
            />
            {/* Confirmation Modal */}
            <ConfirmationModal
                title={confirmModalTitle}
                description={confirmModalDescription}
                isOpen={isConfirmModalOpen}
                onConfirm={handleModalConfirm}
                onCancel={() => setConfirmModalOpen(false)}
            />
            {selectedMember && (
                <ManageRolesModal
                    member={selectedMember}
                    allRoles={allRoles || []}
                    isOpen={isManageRolesModalOpen}
                    onClose={() => setManageRolesModalOpen(false)}
                />
            )}
        </section>
    
    )
}

export default AdminMembersTable;