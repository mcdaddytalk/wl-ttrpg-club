"use client"

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ConfirmationModalProps {
    title: string;
    description: string;
    isOpen: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    confirmDelayMs?: number;
    isLoading?: boolean;
}   

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
    title, 
    description, 
    isOpen, 
    onCancel, 
    onConfirm,
    confirmDelayMs = 2000,
    isLoading = false
}) => {
    const [delayPassed, setDelayPassed] = useState(false);

    useEffect(() => {
        if (isOpen) {
          setDelayPassed(false);
          const timeout = setTimeout(() => setDelayPassed(true), confirmDelayMs);
          return () => clearTimeout(timeout);
        }
      }, [isOpen, confirmDelayMs]);
    
    return (
        <Dialog open={isOpen} onOpenChange={onCancel}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription className="text-sm text-slate-600">{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div className="flex gap-2 justify-end">
                        <Button variant="destructive" onClick={onCancel} disabled={isLoading}>Cancel</Button>
                        <Button
                            variant="outline"
                            onClick={onConfirm}
                            disabled={!delayPassed || isLoading}
                        >
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}