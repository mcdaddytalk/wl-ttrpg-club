import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
    TableHead,
  } from '@/components/ui/table'
  import { Button } from '@/components/ui/button'
import { EmailInvite, MemberData, RoleDO } from '@/lib/types/custom';
import { addRoles, removeRoles, removeUser, sendInviteEmail, sendPasswordResetEmail } from '@/server/authActions';
import { toast } from 'sonner';
import { useState } from 'react';
import { ManageRolesModal } from './ManageRolesModal';
import { useMutation } from '@tanstack/react-query';

  interface AdminMembersTableProps {
    members: MemberData[] | null;
    allRoles: RoleDO[];
  }
  export function AdminMembersTable({ members, allRoles }: AdminMembersTableProps) {
    const [selectedMember, setSelectedMember] = useState<MemberData | null>(null); // For modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSendInvite = async (data: EmailInvite) => {
        try {
          await sendInviteEmail(data);
          toast.success("Invite sent successfully.");
        } catch (err) {
          console.error("Error sending invite:", err);
          toast.error((err as Error).message || "Failed to send invite.");
        }
    };

    const handlePasswordReset = async (email: string) => {
        try {
          await sendPasswordResetEmail(email);
          toast.success("Password reset email sent.");
        } catch (err) {
          console.error("Error sending password reset email:", err);
          toast.error((err as Error).message || "Failed to send password reset email.");
        }
    };
            
    const handleRemoveMember = async (memberId: string) => {
        try {
          await removeUser(memberId);
          toast.success("Member removed successfully.");
        } catch (err) {
          console.error("Error removing member:", err);
          toast.error((err as Error).message || "Failed to remove member.");
        }
    };
    
    const handleUpdateRoles = async (memberId: string, selectedRoles: string[], currentRoles: string[]) => {
        try {
            const rolesToAdd = selectedRoles.filter(role => !currentRoles.includes(role));
            const rolesToRemove = currentRoles.filter(role => !selectedRoles.includes(role));
            // Example: Update roles logic
            if (rolesToAdd.length > 0) {
                await addRoles(memberId, rolesToAdd);
            }
            if (rolesToRemove.length > 0) {
                await removeRoles(memberId, rolesToRemove);
            }
        } catch (err) {
            throw new Error((err as Error).message || "Failed to update roles.");
        }
    };
    

    const openModal = (member: MemberData) => {
        setSelectedMember(member);
        setIsModalOpen(true);
      };
    
      const closeModal = () => {
        setSelectedMember(null);
        setIsModalOpen(false);
      };
    
    if (!members) {
      return <div>No Members Found!</div>;
    }

    return (
        <section>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>Is Minor?</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.phone ?? "N/A"}</TableCell>
                <TableCell>{member.is_admin ? "Yes" : "No"}</TableCell>
                <TableCell>{member.is_minor ? "Yes" : "No"}</TableCell>
                <TableCell>
                  {member.member_roles.map((role) => role.roles.name).join(", ")}
                </TableCell>
                <TableCell>
                  <Button onClick={() => handlePasswordReset(member.email)}>
                    Reset Password
                  </Button>
                  <Button onClick={() => openModal(member)}>Edit Roles</Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* Manage Roles Modal */}
        {selectedMember && (
            <ManageRolesModal
                member={selectedMember}
                allRoles={allRoles}
                isOpen={isModalOpen}
                onClose={closeModal}
            />
        )}
        </section>
      );
  }