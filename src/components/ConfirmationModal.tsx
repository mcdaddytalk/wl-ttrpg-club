"use client"

import React from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "@/components/ui/button"

interface ConfirmationModalProps {
    title: string;
    description: string;
    isOpen: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}   

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ title, description, isOpen, onCancel, onConfirm }) => {
    

    return (
        <Dialog open={isOpen} onOpenChange={onCancel}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription className="text-sm text-slate-600">{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div className="flex gap-2 justify-end">
                        <Button variant='destructive' onClick={onCancel}>Cancel</Button>
                        <Button variant='outline' onClick={onConfirm}>Confirm</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}