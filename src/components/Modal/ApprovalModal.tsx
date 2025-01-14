import { Player } from "@/lib/types/custom";
import { Dialog } from "@radix-ui/react-dialog";
import { useState } from "react";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useTogglePlayerRegistration } from "@/hooks/useTogglePlayerRegistration";


{/* <ApprovalModal
            isOpen={isApprovalModalOpen}
            onCancel={() => setApprovalModalOpen(false)}
            onConfirm={() => handleApprovalSubmit()}
    player={selectedPlayer}
    approvalMode={approvalMode}
/> */}

interface ApprovalModalProps {
    isOpen: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    player: Player;
    gmId: string;
    gameId: string;
    approvalMode: 'approved' | 'rejected' | 'pending';
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({ isOpen, onCancel, onConfirm, player, gmId, gameId, approvalMode }) => {
    const { mutate: togglePlayerRegistration, isPending } = useTogglePlayerRegistration();
    
    const [statusNote, setStatusNote] = useState('');


    const handleApprovalSubmit = () => {
        togglePlayerRegistration(
            { userId: player.id, gmId, gameId, status: approvalMode, status_note: statusNote },
            {
                onSuccess: () => {
                    toast.success(`Player ${approvalMode === 'pending' ? 'unapproved' : approvalMode === 'approved' ? 'approved' : 'kicked'} successfully.`);
                },
                onError: () => {
                    toast.error("Failed to update player.");
                },
                onSettled: () => {
                    onConfirm(); // Close modal after adding member
                }
            }
        );
    };
    
    const approvalStatus = approvalMode === 'pending' ? 'unapprove' : approvalMode === 'approved' ? 'approve' : 'kick';
    const title = approvalStatus.charAt(0).toUpperCase() + approvalStatus.slice(1);

    return (
        <Dialog open={isOpen} onOpenChange={onCancel}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title} Player</DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-sm text-slate-600">
                    Are you sure you want to {approvalStatus} {player.given_name} {player.surname} from this game?
                </DialogDescription>
                    <div className="flex items-center space-x-2 mb-4">
                        <Label htmlFor="statusNote">Note</Label>
                        <Input id="statusNote" name="statusNote" onChange={(e) => setStatusNote(e.target.value)} value={statusNote} />
                    </div>
                <DialogFooter>
                    <div className="flex gap-2 justify-end">
                        <Button variant='destructive' onClick={onCancel} disabled={isPending}>Cancel</Button>
                        <Button variant='outline' onClick={handleApprovalSubmit} disabled={isPending}>
                            {isPending ? 'Please wait...' : approvalMode === 'pending' ? 'Unapprove' : approvalMode === 'rejected' ? 'Kick' : 'Approve'}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};