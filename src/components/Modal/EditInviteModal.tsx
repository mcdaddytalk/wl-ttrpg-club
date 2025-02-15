"use client"

import { InvitedPlayer } from "@/lib/types/custom"
import React, { useState } from "react";
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { toast } from "sonner"

interface EditInviteModalProps {
    isOpen: boolean
    onCancel: () => void
    onConfirm: () => void
    invite: InvitedPlayer
}

const EditInviteModal: React.FC<EditInviteModalProps> = ({ isOpen, onCancel, onConfirm, invite }) => {
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = React.useTransition();

    const handleEditSubmit = async () => {
        setError(null);
        startTransition(() => {
            if (!invite.displayName || !invite.email) {
                setError('All fields are required.');
                return;
            }
        })
        onConfirm();
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={onCancel}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Invite</DialogTitle>
                    <DialogDescription>
                        Edit the details of the invite.
                    </DialogDescription>
                </DialogHeader>
            
                <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={invite.displayName} />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" value={invite.email} />
                        </div>
                    </div>
                </form>
                {error && <p className="text-red-500">{error}</p>}
                <DialogFooter>
                                <Button onClick={handleEditSubmit} disabled={isPending}>
                                    {isPending ? <span className="mr-2">Saving...</span> : <span className="mr-2">Save</span>}
                                </Button>
                                <Button variant="outline" onClick={onCancel} disabled={isPending}>Cancel</Button>
                            </DialogFooter>
                <Button onClick={onCancel}>Cancel</Button>
            </DialogContent>
        </Dialog>
    )
}

export default EditInviteModal;