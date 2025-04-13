"use client";

import { FeedbackDO } from "@/lib/types/custom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  feedback: FeedbackDO | null;
  isOpen: boolean;
  onClose: () => void;
  onHandle: () => void;
}

export default function FeedbackPreviewModal({ feedback, isOpen, onClose, onHandle }: Props) {
  if (!feedback) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{feedback.category.toUpperCase()}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Submitted: {new Date(feedback.submitted_at).toLocaleString()}
          </div>
          <p className="whitespace-pre-wrap text-sm">{feedback.message}</p>
          {!feedback.handled && (
            <Button variant="outline" onClick={onHandle}>
              Mark as Handled
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
