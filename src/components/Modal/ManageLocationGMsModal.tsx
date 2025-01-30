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
import { AdminLocationDO, ContactListDO } from "@/lib/types/custom";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useUpdateLocationGMs } from "@/hooks/useUpdateLocationGMs";

interface ManageLocationGMsModalProps {
    location: AdminLocationDO;
    gamemasters: ContactListDO[];
    isOpen: boolean;
    onConfirm: () => void;
    onClose: () => void;
}

const ManageLocationGMsModal: React.FC<ManageLocationGMsModalProps> = ({ location, gamemasters, isOpen, onClose, onConfirm }) => {
    const currentGMs = location.authorized_gamemasters.map((gm: ContactListDO) => gm.id)
    const [selectedGMs, setSelectedGMs] = useState<string[]>([]);
    const { mutate: updateGMs, isPending } = useUpdateLocationGMs();

    const handleCheckboxChange = (gmId: string) => {
        if (selectedGMs.includes(gmId)) {
            setSelectedGMs(selectedGMs.filter((id) => id !== gmId));
        } else {
            setSelectedGMs([...selectedGMs, gmId]);
        }
    };

    const handleSubmit = async () => {
        updateGMs(
            { locationId: location.id, selectedGMs, currentGMs },
            {
                onSuccess: () => {
                    toast.success("GMs updated successfully.");
                },
                onError: () => {
                    toast.error("Failed to update GMs.");
                },
                onSettled: () => {
                    onConfirm(); // Close modal after updating GMs
                }
            }
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Manage GMs</DialogTitle>
                    <DialogDescription>Assign GMs to this location.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-2">
                    {gamemasters.map((gm) => (
                        <div key={gm.id} className="flex items-center space-x-2">
                            <Checkbox checked={selectedGMs.includes(gm.id)} onCheckedChange={() => handleCheckboxChange(gm.id)} />
                            <Label>{gm.given_name} {gm.surname}</Label>
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={isPending}>
                        {isPending ? <span className="mr-2">Saving...</span> : <span className="mr-2">Save</span>}
                    </Button>
                    <Button variant="outline" onClick={onClose} disabled={isPending}>Cancel</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ManageLocationGMsModal;