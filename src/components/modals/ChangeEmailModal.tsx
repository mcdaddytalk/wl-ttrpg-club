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
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MemberDO } from "@/lib/types/data-objects";
import { useSendChangeEmail } from "@/hooks/useSendChangeEmail";

interface ChangeEmailModalProps {
    isOpen: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    member: MemberDO;
}

export const ChangeEmailModal = ({
    isOpen,
    onCancel,
    onConfirm,
    member,
}: ChangeEmailModalProps) => {
    const { mutate: sendChangeEmail } = useSendChangeEmail();
        
    const [email, setEmail] = useState(member.email);


    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);        
    };

    const handleSubmit = async () => {
        if (!email) {
            toast.error("Email is required.");
            return;
        }

        sendChangeEmail({
            oldEmail: member.email,
            newEmail: email,
            id: member.id
        }, {
            onSuccess: () => {
                toast.success("Email changed successfully!");
            },
            onError: () => {
                toast.error("Failed to change email.");
            },
            onSettled: () => {
                    onConfirm(); // Close modal after updating roles
            }
        })
    };

    return (
        <Dialog open={isOpen} onOpenChange={onCancel}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Change Email</DialogTitle>
                    <DialogDescription>
                        Enter new email address.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={handleEmailChange}
                            className="col-span-3 rounded-md border-0 bg-zinc-300 px-3 py-2 text-zinc-900 focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSubmit}>
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};