"use client"

import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useArchiveGame } from "@/hooks/admin/useAdminGames";

interface ArchiveGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: { id: string; title: string; deleted_at: string | null };
}

export const ArchiveGameModal = ({ isOpen, onClose, game }: ArchiveGameModalProps) => {
  const isArchived = !!game.deleted_at;
  const { mutate: toggleArchive, isPending } = useArchiveGame(game.id);

  const handleConfirm = () => {
    toggleArchive(!isArchived, {
      onSuccess: () => {
        toast.success(`Game ${isArchived ? "restored" : "archived"} successfully`);
        onClose();
      },
      onError: () => {
        toast.error("Failed to update game");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>{isArchived ? "Unarchive Game" : "Archive Game"}</DialogHeader>
        <p>
          Are you sure you want to {isArchived ? "restore" : "archive"} <strong>{game.title}</strong>?
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            variant={isArchived ? "default" : "destructive"}
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isArchived ? "Unarchive" : "Archive"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
