import { useEffect, useState } from "react";
import { useCreateInvite } from "@/hooks/admin/useAdminInvites";
import { normalizeEmail, normalizePhoneE164 } from "@/utils/normalize";
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

function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

const SendInviteModal = ({ isOpen, onClose }: SendInviteModalProps) => {
    const [form, setForm] = useState({
      game_id: "",
      display_name: "",
      email: "",
      phone: "",
      gamemaster_id: "",
      expires_in_days: 7
    });
  
    const { mutate: createInvite, isPending } = useCreateInvite();
    const { data: games, isError, isLoading: isGamesLoading } = useAvailableGames();

    // Debounce the raw inputs
    const debouncedEmail = useDebouncedValue(form.email, 300);
    const debouncedPhone = useDebouncedValue(form.phone, 300);

    // Normalize after debounce (guard to avoid loops)
    useEffect(() => {
        const normalized = normalizeEmail(debouncedEmail);
        if (normalized && normalized !== form.email) {
            setForm(f => ({ ...f, email: normalized }));
        }
    }, [debouncedEmail]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const normalized = normalizePhoneE164(debouncedPhone);
        if (normalized && normalized !== form.phone) {
            setForm(f => ({ ...f, phone: normalized }));
        }
    }, [debouncedPhone]); // eslint-disable-line react-hooks/exhaustive-deps
    
    const handleSubmit = () => {
        if (!form.game_id || !form.display_name || (!form.email && !form.phone)) {
            toast.error("Game, name, and at least one contact method required.");
            return;
        }
      
        const [first, ...rest] = form.display_name.trim().split(/\s+/);
        const invitee = {
            displayName: form.display_name.trim(),
            given_name: first ?? form.display_name.trim(),
            surname: rest.join(" "),
            email: form.email || undefined,
            phone: form.phone || undefined,
            expires_in_days: Number(form.expires_in_days) || 7, // if you expose it
        };

        createInvite({
                game_id: form.game_id,
                gamemaster_id: form.gamemaster_id,
                invitees: [invitee],
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
            <div className="flex items-center gap-2">
                <Label>Expires (days)</Label>
                <Input
                    type="number"
                    min={1}
                    max={60}
                    value={form.expires_in_days}
                    onChange={(e) => setForm({ ...form, expires_in_days: Number(e.target.value) })}
                />
            </div>
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
  