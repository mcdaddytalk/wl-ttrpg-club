"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AdminNoteDO } from "@/lib/types/custom";
import { format } from "date-fns";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  note: AdminNoteDO | null;
  onDelete?: (id: string) => void;
  onEdit?: (note: AdminNoteDO) => void;
};

export const AdminNotePreviewModal = ({ isOpen, onClose, note, onDelete, onEdit }: Props) => {
  if (!note) return null;

  const authorName =
    note.author?.displayName
      ? `${note.author?.displayName ?? ""}`.trim()
      : note.author?.email;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Admin Note</DialogTitle>
          <DialogDescription>
            Author: {authorName || "Deleted user"} <br />
            Created: {format(new Date(note.created_at), "yyyy-MM-dd HH:mm")}
          </DialogDescription>
        </DialogHeader>
        <div className="whitespace-pre-wrap text-sm leading-relaxed pt-4">
          {note.note}
        </div>
        <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onEdit?.(note)}>
                Edit
            </Button>
            <Button variant="destructive" onClick={() => onDelete?.(note.id)}>
                Delete
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
