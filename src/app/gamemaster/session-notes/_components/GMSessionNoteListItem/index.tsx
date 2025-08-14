"use client";

import { GMSessionNoteDO } from "@/lib/types/custom";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/helpers"; // your dayjs helper
import { cn } from "@/lib/utils";

export interface GMSessionNoteListItemProps {
  note: GMSessionNoteDO;
  onSelect: (note: GMSessionNoteDO) => void;
  className?: string;
}

export default function GMSessionNoteListItem({
  note,
  onSelect,
  className,
}: GMSessionNoteListItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(note)}
      className={cn(
        "w-full text-left rounded-lg border p-4 hover:shadow focus:outline-none focus:ring-2 focus:ring-ring/50 transition",
        "group bg-card",
        className
      )}
      aria-label={`Open note ${note.title || "Untitled"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold">
              {note.title || "Untitled"}
            </h3>
            {note.is_visible_to_players ? (
              <Badge variant="secondary">Player-visible</Badge>
            ) : (
              <Badge variant="outline">GM-only</Badge>
            )}
          </div>

          <div className="mt-1 text-xs text-muted-foreground flex flex-wrap items-center gap-2">
            <span className="whitespace-nowrap">
              {formatDate(note.session_date, { formatStr: "MMM D, YYYY" })}
            </span>
            <span className="opacity-50">•</span>
            <span className="truncate">Game: {note.game_title ?? "—"}</span>
          </div>
        </div>

        <div className="shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition text-xs">
          View / Edit
        </div>
      </div>

      {note.body ? (
        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
          {note.body}
        </p>
      ) : null}
    </button>
  );
}