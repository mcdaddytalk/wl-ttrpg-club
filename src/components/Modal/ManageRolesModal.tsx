"use client";

import React, { useState } from "react";
import { 
    Dialog, 
    DialogContent,
    DialogDescription, 
    DialogHeader, 
    DialogFooter,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import { MemberDO, RoleDO } from "@/lib/types/custom";
import { Label } from "@/components/ui/label";
import { useUpdateRoles } from "@/hooks/useUpdateRoles";
import { toast } from "sonner";

interface RoleManagementModalProps {
  member: MemberDO;
  allRoles: RoleDO[];
  isOpen: boolean;
  onCancel: () => void;
}

export const ManageRolesModal = ({ member, allRoles, isOpen, onCancel }: RoleManagementModalProps): React.ReactElement => {
    const currentRoles = member.roles.map((role: RoleDO) => role.id)
    const [selectedRoles, setSelectedRoles] = useState<string[]>( [...currentRoles]);
    const { mutate: updateRoles, isPending } = useUpdateRoles();
        
    const toggleRole = (role: RoleDO) => {
        setSelectedRoles((prev) =>
          prev.includes(role.id) ? prev.filter((r) => r !== role.id) : [...prev, role.id]
        );
    };
    
    const handleSubmit = async () => {
        updateRoles(
            {memberId: member.id, selectedRoles, currentRoles},
            {
                onSuccess: () => {
                    toast.success("Roles updated successfully.");
                },
                onError: () => {
                    toast.error("Failed to update roles.");
                },
                onSettled: () => {
                    onCancel(); // Close modal after updating roles
                }
            }
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onCancel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
                <span className="text-lg font-semibold">Manage Roles</span>
            </DialogTitle>
            <DialogDescription>
                <span className="text-sm text-slate-700">Select roles for {member.email}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-slate-700">
            {allRoles.map((role: RoleDO) => (
                <div key={role.id} className="flex flex-row items-start space-x-3 space-y-0">
                    <Checkbox
                        key={role.id}
                        id={role.id}
                        checked={selectedRoles.includes(role.id)}
                        onCheckedChange={() => toggleRole(role)}
                        className="flex items-center space-x-2"
                        disabled={role.name === "member"}
                    />
                    <Label
                        htmlFor={role.id}
                        className="text-slate-700 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {role.name}
                    </Label>
                </div>              
            ))}
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit} disabled={isPending}>
                {isPending ? <span className="mr-2">Saving...</span> : <span className="mr-2">Save</span>}
            </Button>
            <Button variant="outline" onClick={onCancel} disabled={isPending}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  );
};
