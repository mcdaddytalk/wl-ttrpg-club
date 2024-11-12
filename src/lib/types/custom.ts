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
  interval: string;
  maxSeats: number;
  status: string;
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
  experienceLevel: string;
  gamemasterInterest: string;
  preferredSystem: string;
  availability: string;
  agreeToRules: boolean;
}