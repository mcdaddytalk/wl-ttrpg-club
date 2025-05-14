import { useCreateInvite } from "@/hooks/admin/useAdminInvites";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useAvailableGames } from "@/hooks/admin/useAdminGames";


// props: isOpen, onClose
interface SendInviteModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SendInviteModal = ({ isOpen, onClose }: SendInviteModalProps) => {
    const [form, setForm] = useState({
      game_id: "",
      display_name: "",
      email: "",
      phone: "",
      gamemaster_id: "",
    });
  
    const { mutate: createInvite, isPending } = useCreateInvite();
    const { data: games, isError, isLoading: isGamesLoading } = useAvailableGames();
    
    const handleSubmit = () => {
        if (!form.game_id || !form.display_name || (!form.email && !form.phone)) {
            toast.error("Game, name, and at least one contact method required.");
            return;
        }
      
        const invitee = {
            displayName: form.display_name,
            email: form.email || undefined,
            phone: form.phone || undefined,
            given_name: form.display_name.split(" ")[0], // use first word
            surname: form.display_name.split(" ").slice(1).join(" "), // use remaining words
        };

        createInvite({
                game_id: form.game_id,
                gamemaster_id: form.gamemaster_id,
                invitee,
            }, {
            onSuccess: () => {
                toast.success("Invite sent");
                onClose();
            },
            onError: () => toast.error("Failed to send invite"),
        });
    };
  
    if (isGamesLoading) {
        return <div>Loading...</div>;
    }
  
    if (!games || !isError) {
        return <div>No games found</div>;
    }

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>Send New Invite</DialogHeader>
          <div className="space-y-4">
            {/* Game Select, Display Name, Email, Phone, Message */}
            <Label>Game</Label>
            <Select
                value={form.game_id}
                onValueChange={(value) => {
                    const selected = games.find((g) => g.id === value);
                    setForm({
                        ...form,
                        game_id: value,
                        gamemaster_id: selected?.gamemaster.id || "",
                    });
                }}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select a Game..." />
                </SelectTrigger>
                <SelectContent>
                    {games.map((game) => (
                        <SelectItem key={game.id} value={game.id}>
                            {game.title} {game.gamemaster ? `— ${game.gamemaster.profiles.given_name} ${game.gamemaster.profiles.surname}` : ""}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Input placeholder="Display Name" value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} />
            <Input placeholder="Email (if external)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isPending}>Send Invite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  export default SendInviteModal;
  