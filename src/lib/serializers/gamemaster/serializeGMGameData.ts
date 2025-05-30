import { GMGameData } from "@/lib/types/custom";
import { GMGameDO } from "@/lib/types/data-objects";

export function serializeGMGameData(game: GMGameData): GMGameDO {
  const schedule = game.game_schedule?.[0];

  const invites = game.game_invites?.length ?? 0;
  const pending = game.game_registrations?.filter((r) => r.status === "pending").length ?? 0;
  const registered = game.game_registrations?.filter((r) => r.status === "approved").length ?? 0;

  return {
    id: game.id,
    title: game.title,
    description: game.description,
    system: game.system,
    coverImage: game.cover_image,
    gameCode: game.game_code,
    scheduled_next: schedule?.next_game_date ?? null,
    interval: schedule?.interval ?? null,
    dow: schedule?.day_of_week ?? null,
    maxSeats: game.max_seats,
    status: game.status,
    schedStatus: schedule?.status ?? null,
    location_id: schedule?.location_id ?? null,
    location: schedule?.location ?? null,
    visibility: game.visibility,
    gamemaster: game.gamemaster,
    invites,
    pending,
    registered,
  };
}
