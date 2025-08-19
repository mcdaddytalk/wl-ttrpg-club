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
    children?: React.ReactNode;
    confirmLabel?: string;
    confirmDisabled?: boolean;
    confirmVariant?: React.ComponentProps<typeof Button>["variant"];
}   

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
    title, 
    description, 
    isOpen, 
    onCancel, 
    onConfirm,
    confirmDelayMs = 2000,
    isLoading = false,
    children,
    confirmLabel = "Confirm",
    confirmDisabled = false,
    confirmVariant = "destructive",
}) => {
    const [delayPassed, setDelayPassed] = useState(false);

    useEffect(() => {
        if (isOpen) {
          setDelayPassed(false);
          const timeout = setTimeout(() => setDelayPassed(true), confirmDelayMs);
          return () => clearTimeout(timeout);
        }
    }, [isOpen, confirmDelayMs]);

    const disableConfirm = !delayPassed || isLoading || confirmDisabled;
    
    return (
        <Dialog open={isOpen} onOpenChange={onCancel}>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="text-sm text-slate-600">
                {description}
            </DialogDescription>
            </DialogHeader>

            {/* NEW: custom body slot */}
            {children ? <div className="mt-3 space-y-3">{children}</div> : null}

            <DialogFooter>
            <div className="flex gap-2 justify-end">
                <Button variant={confirmVariant} onClick={onCancel} disabled={isLoading}>
                Cancel
                </Button>
                <Button variant="outline" onClick={onConfirm} disabled={disableConfirm}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : confirmLabel}
                </Button>
            </div>
            </DialogFooter>
        </DialogContent>
        </Dialog>
    );
};