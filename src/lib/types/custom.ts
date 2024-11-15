import { QueryError } from "@supabase/supabase-js";

export type Provider = 'google' | 'discord';

export type RoleData = {
  roles: { name: string }
}
export type SupabaseRoleResponse = {
  error: QueryError | null;
  data: RoleData[];
  count: number | null;
  status: number;
  statusText: string;
}

export type ProfileData = {
  given_name: string;
  surname: string;
  phone: string | null;
  birthday: string | null;
  bio: string | null;
  avatar: string | null;
}

export type SupabaseProfileResponse = {
  error: QueryError | null;
  data: ProfileData[];
  count: number | null;
  status: number;
  statusText: string;
}

export type RegisteredGame = {
  id: string;
  title: string;
  description: string;
  system: string;
  scheduled_for: Date;
  status: string;
  registration_date: Date;
  num_players: number;
  gm_name: string;
  gm_member_id: string;
}

export type RegisteredCharacter = {
  id: string;
  name: string;
  description: string;
  system: string;
  registered_at: Date;
  member_id: string;
  game_id: string;
  gm_name: string;
  gm_member_id: string;
}

export type UpcomingGame = {
  id: string;
  title: string;
  description: string;
  system: string;
  scheduled_for: Date;
  status: string;
  num_players: number;
  gm_name: string;
  gm_member_id: string;
}

export type SupabaseUpcomingGamesResponse = {
  error: QueryError | null;
  data: GameData[];
  count: number | null;
  status: number;
  statusText: string;
}

export type GameData = {
  game_id: string;
  game_name: string;
  description: string;
  system: string;
  gamemaster_id: string;
  gm_given_name: string;
  gm_surname: string;
  status: string;
  first_game_date: Date; // or Date if you convert the date
  last_game_date: Date | null; // or Date if you convert the date
  registered_at: Date;
  num_players: number;
}

export type GMGameData = {
  id: string;
  title: string;
  description: string;
  system: string;
  scheduled_for: Date;
  interval: GameInterval;
  day_of_week: DOW;
  maxSeats: number;
  status: GameStatus;
  seats: number;
}

export type NewContact = {
  firstName: string;
  surname: string;
  email: string;
  phoneNumber: string;
  isMinor: boolean;
  parentFirstName?: string;
  parentSurname?: string;
  parentEmail?: string;
  parentPhone?: string;
  experienceLevel: ExperienceLevel;
  gamemasterInterest: string;
  preferredSystem: string;
  availability: string;
  agreeToRules: boolean;
}

export type GameSchedule = {
  id: string;
  game_id: string;
  game_name: string;
  interval: string;
  day_of_week: string;
  first_game_date: Date;
  next_game_date: Date;
  last_game_date: Date;
  status: string;
  game_registrations: GameRegistrant[]
}

export type GameRegistrant = {
  member_id: string;
  given_name: string;
  surname: string;
}

export type Player = {
  id: string;
  email: string;
  phoneNumber: string;
  givenName: string;
  surname: string;
  avatar: string;
  isMinor: boolean;
  experienceLevel: ExperienceLevel;
}

export type SupaGameData = {
  id: string;
  name: string;
}

export type SupaProfileData = {
  id: string;
  given_name: string;
  surname: string;
}

export type SupaGameRegistrationData = {
  member_id: string;
  profiles: SupaProfileData[];
}

export type SupabaseGameScheduleData = {
  id: string;
  game_id: string;
  interval: string;
  day_of_week: string;
  first_game_date: Date;
  next_game_date: Date;
  last_game_date: Date;
  status: string;
  games: SupaGameData[];
  game_registrations: SupaGameRegistrationData[];
};

type DOW = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

type GameStatus = 'active' | 'scheduled' | 'completed' | 'awaiting-players' | 'full' | 'cancelled';

type ExperienceLevel = 'new' | 'novice' | 'seasoned' | 'player-gm' | 'forever-gm';

type GameInterval = 'weekly' | 'bimonthly' | 'monthly' | 'yearly' | 'custom';

export type GMGameSchedule = {
  id: string;
  title: string;
  system: string;
  interval: GameInterval;
  dow: DOW;
  scheduled_next: Date;
  maxSeats: number;
  registered: number;
  status: GameStatus;
}

export type SupaGameSchedule = {
  gm_id: string;
  game_id: string;
  interval: GameInterval;
  day_of_week: DOW;
  first_game_date: Date;
  next_game_date: Date;
  last_game_date?: Date;
  status: GameStatus;
}