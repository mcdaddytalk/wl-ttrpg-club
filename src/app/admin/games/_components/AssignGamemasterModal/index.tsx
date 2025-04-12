import { Dialog, DialogHeader, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { useAdminGamemasters, useAdminAssignGamemaster } from "@/hooks/admin/useAdminGamemasters";

interface AssignGamemasterModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: { id: string; title: string };
}

export const AssignGamemasterModal = ({ isOpen, onClose, game }: AssignGamemasterModalProps) => {
  const { data: gamemasters = [] } = useAdminGamemasters();
  const { mutate: assignGM, isPending } = useAdminAssignGamemaster(game.id);
  const [selected, setSelected] = useState<string>("");

  const handleConfirm = () => {
    assignGM(selected, {
      onSuccess: () => {
        toast.success("Gamemaster assigned");
        onClose();
      },
      onError: () => {
        toast.error("Failed to assign gamemaster");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>Assign Gamemaster</DialogHeader>
        <div className="space-y-4">
          <Label htmlFor="gm">Select a Gamemaster for <strong>{game.title}</strong></Label>
          <Select onValueChange={setSelected}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a Gamemaster..." />
            </SelectTrigger>
            <SelectContent>
              {gamemasters.map((gm) => (
                <SelectItem key={gm.id} value={gm.id}>
                  {gm.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={!selected || isPending}>Assign</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
