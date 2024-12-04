"use client"

import React from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useAddMember } from "@/hooks/useAddMember"

interface AddMemberModalProps {
    isOpen: boolean
    onCancel: () => void
    onConfirm: () => void
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onCancel, onConfirm }) => {
    const { mutate: addMember, isPending } = useAddMember();

    const [email, setEmail] = React.useState("");
    const [givenName, setGivenName] = React.useState("");
    const [surname, setSurname] = React.useState("");
    const [isMinor, setIsMinor] = React.useState(false);
    
    const handleSubmit = async () => {
        addMember(
            {email, given_name: givenName, surname: surname, is_minor: isMinor},
            {
                onSuccess: () => {
                    toast.success("Member added successfully.");
                },
                onError: () => {
                    toast.error("Failed to add member.");
                },
                onSettled: () => {
                    onConfirm(); // Close modal after adding member
                }
            }
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onCancel}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Member</DialogTitle>
                    <DialogDescription>
                        Add a new member to the club.
                    </DialogDescription>
                </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="email" className="text-right">Email</label>
                            <input type="email" id="email" className="col-span-3" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="givenName" className="text-right">Given Name</label>
                            <input type="text" id="givenName" className="col-span-3" value={givenName} onChange={(e) => setGivenName(e.target.value)} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="surname" className="text-right">Surname</label>
                            <input type="text" id="surname" className="col-span-3" value={surname} onChange={(e) => setSurname(e.target.value)} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="isMinor" className="text-right">Is Minor</label>
                            <input type="checkbox" id="isMinor" className="col-span-3" checked={isMinor} onChange={(e) => setIsMinor(e.target.checked)} />
                        </div>
                    </div>
                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={isPending}>
                        {isPending ? <span className="mr-2">Adding...</span> : <span className="mr-2">Add</span>}
                    </Button>
                    <Button variant="outline" onClick={onCancel} disabled={isPending}>Cancel</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}