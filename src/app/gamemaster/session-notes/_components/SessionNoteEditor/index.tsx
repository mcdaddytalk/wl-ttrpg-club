import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SessionNoteFormSchema, SessionNoteFormValues } from "@/lib/validation/sessionNotes";
import { useDeleteSessionNote, useSaveSessionNote } from "@/hooks/gamemaster/useGamemasterSessionNotes";
import { GMSessionNoteDO } from "@/lib/types/custom";
import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";
import logger from "@/utils/logger";
import { toDatetimeLocal } from "@/utils/helpers";
import { GMGameSummaryDO } from "@/lib/types/data-objects";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Markdown } from "@/components/Markdown";

export function SessionNoteEditor({
  isOpen,
  onCancel,
  onSaved,
  note,
  defaultGameId,
  games = [],
}: {
  isOpen: boolean;
  onCancel: () => void;
  onSaved: () => void;
  note?: GMSessionNoteDO | null;
  defaultGameId?: string;
  games: GMGameSummaryDO[];
}) {
  const defaults: SessionNoteFormValues = useMemo(() => {
    if (note?.id) {
      // convert DB ISO to datetime-local string
      logger.debug("Note", note);
      return {
        game_id: note.game_id,
        schedule_id: note.schedule_id ?? "",
        title: note.title ?? "",
        body: note.body ?? "",
        session_date: toDatetimeLocal(note.session_date) || toDatetimeLocal(new Date()),
        is_visible_to_players: !!note.is_visible_to_players,
      };
    }
    // new note
    return {
      game_id: defaultGameId ?? "",   // if empty, show a game dropdown in the editor
      schedule_id: "",
      title: "",
      body: "",
      session_date: toDatetimeLocal(new Date()),
      is_visible_to_players: false,
    };
  }, [note, defaultGameId]);

  const form = useForm<SessionNoteFormValues>({
    resolver: zodResolver(SessionNoteFormSchema),
    defaultValues: defaults,
  });

  const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = form;
  const watchedGameId = watch("game_id");
  const watchedBody = watch("body");

  // Choose which game-id we should use for invalidation after save/delete
  const invalidateGameId = note?.game_id ?? defaultGameId ?? watchedGameId ?? undefined;

  const { mutate: saveMutation, isPending: savePending } = useSaveSessionNote(
    note?.id,
    onSaved,
    invalidateGameId
  );
  const { mutate: deleteMutation, isPending: deletePending } = useDeleteSessionNote(invalidateGameId);
  const [tab, setTab] = useState<"write" | "preview">("write");

  const onSubmit = handleSubmit((values) => {
    // If there's no defaultGameId, ensure user selected a game
    if (!defaultGameId && !values.game_id) {
      toast.error("Please choose a game for this note.");
      return;
    }
    saveMutation(values, {
      onSuccess: () => {
        toast.success("Note saved");
        onSaved();
      },
      onError: () => toast.error("Failed to save note"),
    });
  });

  const handleDelete = (id: string) => {
    deleteMutation(id, {
      onSuccess: () => {
        toast.success("Note deleted");
        onCancel();
      },
      onError: () => toast.error("Failed to delete note"),
    });
  };

  const currentGameTitle = games.find((g) => g.id === (defaultGameId ?? watchedGameId))?.title;

  useEffect(() => {
    reset(defaults);
  }, [defaults, reset]);

  useEffect(() => {
    setTab("write");
  }, [note?.id, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent
        className="w-[min(90vw,42rem)] max-w-none sm:max-h-[85vh] overflow-hidden p-0"
        aria-describedby="session-note-desc"
      >
        {/* Fixed header */}
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>{note ? "Edit Note" : "New Session Note"}</DialogTitle>
          <DialogDescription id="session-note-desc">
            {note ? "Edit the note below." : "Create a new note for this game session."}
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable body */}
        <div className="px-6 pb-6 w-full">
          <form
            onSubmit={onSubmit}
            className="flex flex-col gap-4 not-prose max-h-[60vh] overflow-y-auto pr-1 min-w-0 w-full"
          >
            {/* Game */}
            <div className="min-w-0">
              <Label>Game</Label>
              <Select
                value={watchedGameId ?? ""}
                onValueChange={(val) => setValue("game_id", val, { shouldValidate: true, shouldDirty: true })}
                disabled={!!defaultGameId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a game" />
                </SelectTrigger>
                <SelectContent className="max-h-[50vh]">   {/* guard dropdown height */}
                  {games.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {defaultGameId && (
                <p className="text-xs text-muted-foreground mt-1">
                  Notes will be created for <span className="font-medium">{currentGameTitle ?? "this game"}</span>.
                </p>
              )}
              {errors.game_id && <p className="text-sm text-red-500">{errors.game_id.message}</p>}
            </div>

            {/* Title */}
            <div className="min-w-0">
              <Label>Title</Label>
              <Input className="w-full" {...register("title")} />
              {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
            </div>

            {/* Session Date */}
            <div className="min-w-0">
              <Label>Session Date</Label>
              <Input className="w-full" type="datetime-local" {...register("session_date")} />
              {errors.session_date && <p className="text-sm text-red-500">{errors.session_date.message}</p>}
            </div>

            {/* Markdown editor */}
            <div className="space-y-2 min-w-0">
              <Label>Content (Markdown supported)</Label>

              <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="w-full">
                <TabsList>
                  <TabsTrigger value="write">Write</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>

                <TabsContent value="write" className="mt-3 data-[state=inactive]:hidden min-w-0">
                  <Textarea
                    rows={10}
                    className="resize-y max-h-[55vh] w-full"
                    {...register("body")}
                    placeholder="Write your note in Markdown..."
                  />
                  {errors.body && <p className="text-sm text-red-500 mt-1">{errors.body.message}</p>}
                  <p className="text-xs text-muted-foreground mt-2">
                    Tips: use <code>**bold**</code>, <code>_italics_</code>, lists, and code fences. Links auto‑render.
                  </p>
                </TabsContent>

                <TabsContent value="preview" className="mt-3 data-[state=inactive]:hidden min-w-0">
                  <div className="prose prose-sm max-w-full dark:prose-invert
                    prose-pre:whitespace-pre-wrap prose-pre:break-words prose-code:break-words
                    border rounded-md p-4 bg-muted/30
                    max-h-[55vh] overflow-y-auto overflow-x-auto pr-1 
                    min-w-0 w-full [overflow-wrap:anywhere] [word-break:break-word]
                    [contain:content]"
                  >
                    {watchedBody?.trim() ? (
                      <Markdown>{watchedBody}</Markdown>
                    ) : (
                      <p className="text-sm text-muted-foreground">Nothing to preview yet.</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Visibility */}
            <div className="flex items-center gap-2 min-w-0">
              <Switch
                checked={watch("is_visible_to_players")}
                onCheckedChange={(val) => setValue("is_visible_to_players", val, { shouldDirty: true })}
              />
              <Label>Visible to players</Label>
            </div>
          </form>
        </div>

        {/* Fixed footer */}
        <DialogFooter className="px-6 pb-6 pt-2">
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
          <Button type="submit" form={/* form id not needed since inside, but okay to add */ undefined} disabled={savePending}>
            Save Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
