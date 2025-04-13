import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useEffect } from "react";
import { useAddUpdateAdminNote } from "@/hooks/admin/useAdminNotes";
import { useAuth } from "@/hooks/useAuth";
import { Label } from "@/components/ui/label";
import { useAdminMembers } from "@/hooks/admin/useAdminMembers";
import { useAvailableGames } from "@/hooks/admin/useAdminGames";


const schema = z.object({
  id: z.string().optional(),
  note: z.string().min(2),
  target_type: z.enum(["member", "game"]),
  target_id: z.string(),
});

export type FormValues = z.infer<typeof schema>;

type Props = {
  note: FormValues | null;
  onSaved: () => void;
};

export function AdminNoteForm({ note, onSaved }: Props) {
    const { user } = useAuth();
    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
        note: "",
        target_type: "member",
        target_id: "",    },
    });

    const { data: members = [], isLoading: isLoadingMembers } = useAdminMembers();
    const { data: games = [], isLoading: isLoadingGames } = useAvailableGames();

    // reset when editing note changes
    useEffect(() => {
        if (note) form.reset(note);
    }, [note, form]);

    const { mutate: saveNote, isPending } = useAddUpdateAdminNote();

    const handleSubmit = form.handleSubmit((values) => {
        if (!user?.id) {
            toast.error("You're not logged in");
            return;
        }
        saveNote({ ...values, author_id: user.id }, {
        onSuccess: () => {
            toast.success("Note saved");
            form.reset();
            onSaved();
        },
        onError: () => {
            toast.error("Failed to save note");
        }
        });
    });

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <Label className="block mb-1 font-medium">Target Type</Label>
            <Controller
                control={form.control}
                name="target_type"
                render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select target type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="game">Game</SelectItem>
                    </SelectContent>
                    </Select>
                )}
            />
        </div>

        {form.watch("target_type") === "member" && (
            <div>
                <Label>Member (Target ID)</Label>
                <Select
                    onValueChange={(val) => form.setValue("target_id", val)}
                    value={form.watch("target_id")}
                    disabled={isLoadingMembers}
                >
                <SelectTrigger>
                    <SelectValue placeholder="Select a member" />
                </SelectTrigger>
                <SelectContent>
                    {members?.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                        {m.given_name} {m.surname} ({m.email})
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
        )}

        {form.watch("target_type") === "game" && (
            <div>
                <Label>Game (Target ID)</Label>
                <Select
                    onValueChange={(val) => form.setValue("target_id", val)}
                    value={form.watch("target_id")}
                    disabled={isLoadingGames}
                >
                <SelectTrigger>
                    <SelectValue placeholder="Select a game" />
                </SelectTrigger>
                <SelectContent>
                    {games?.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                        {g.title} ({g.visibility === "public" ? "Public" : "Private"}) - {g.system}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
        )}

        <div>
            <label className="block mb-1 font-medium">Note</label>
            <Textarea rows={5} {...form.register("note")} />
        </div>

        <Button type="submit" disabled={isPending}>
            {form.watch("id") ? "Update Note" : "Create Note"}
        </Button>
        </form>
    );
}
