import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SessionNoteFormValues, SessionNoteSchema } from "@/lib/validation/sessionNotes";
import { useDeleteSessionNote, useSaveSessionNote } from "@/hooks/gamemaster/useGamemasterSessionNotes";
import { GMSessionNoteDO } from "@/lib/types/custom";
import { toast } from "sonner";

export function SessionNoteEditor({
  isOpen,
  onCancel,
  onSaved,
  note,
}: {
  isOpen: boolean;
  onCancel: () => void;
  onSaved: () => void;
  note?: GMSessionNoteDO | null;
}) {
  const form = useForm<SessionNoteFormValues>({
    resolver: zodResolver(SessionNoteSchema),
    defaultValues: note ?? {
      title: "",
      body: "",
      session_date: new Date().toISOString().slice(0, 16),
      is_visible_to_players: false,
    },
  });

  const { register, handleSubmit, watch, setValue, formState: { errors } } = form;

  const { mutate: saveMutation, isPending: savePending } = useSaveSessionNote();
  const { mutate: deleteMutation, isPending: deletePending } = useDeleteSessionNote();

  const handleDelete = (id: string) => {
    deleteMutation(id, {
        onSuccess: () => {
            toast.success("Note deleted");
            onCancel();
        },
        onError: () => toast.error("Failed to delete note"),
    });
    onCancel();
  };

  const onSubmit = handleSubmit((values) => {
    saveMutation(values, {
        onSuccess: () => {
            toast.success("Note saved");
            onSaved();
        },
        onError: () => toast.error("Failed to save note"),
    })
});

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{note ? "Edit Note" : "New Session Note"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input {...register("title")} />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>

          <div>
            <Label>Session Date</Label>
            <Input type="datetime-local" {...register("session_date")} />
            {errors.session_date && <p className="text-sm text-red-500">{errors.session_date.message}</p>}
          </div>

          <div>
            <Label>Content</Label>
            <Textarea rows={8} {...register("body")} />
            {errors.body && <p className="text-sm text-red-500">{errors.body.message}</p>}
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={watch("is_visible_to_players")}
              onCheckedChange={(val) => setValue("is_visible_to_players", val)}
            />
            <Label>Visible to players</Label>
          </div>

          <DialogFooter className="flex items-center justify-between">
            {note && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => handleDelete(note.id)}
                disabled={deletePending}
              >
                Delete Note
              </Button>
            )}
            <Button type="submit" disabled={savePending}>
              Save Note
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
