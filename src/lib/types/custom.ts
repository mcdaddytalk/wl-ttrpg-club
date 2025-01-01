import { SupabaseClient, QueryError } from "@supabase/supabase-js";
import type { Database } from "./supabase";
import { type DataTableConfig } from "@/config/data-table";
import { type z } from "zod";
import { type filterSchema } from "@/lib/parsers";
import { ColumnSort } from "@tanstack/react-table";

/* DataTable Support Types */
export type ColumnType = DataTableConfig["columnTypes"][number]
export type FilterOperator = DataTableConfig["globalOperators"][number]
export interface SearchParams {
  [key: string]: string | string[] | undefined
}
export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}
export type StringKeyOf<T> = Extract<keyof T, string>
export interface Option {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
  count?: number
}
export type Filter<TData> = Prettify<
  Omit<z.infer<typeof filterSchema>, "id"> & {
    id: StringKeyOf<TData>
  }
>
export interface DataTableFilterField<TData> {
  id: StringKeyOf<TData>
  label: string
  placeholder?: string
  options?: Option[]
}
export interface ExtendedColumnSort<TData> extends Omit<ColumnSort, "id"> {
  id: StringKeyOf<TData>
}
export type ExtendedSortingState<TData> = ExtendedColumnSort<TData>[]
export type JoinOperator = DataTableConfig["joinOperators"][number]["value"]

/* ENUM Types */
export type DOW = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
export type GameStatus = 'draft' |'active' | 'scheduled' | 'completed' | 'awaiting-players' | 'full' | 'canceled';
export const experienceLevels = ['new', 'novice', 'seasoned', 'player-gm', 'forever-gm'] as const;
export type ExperienceLevel = typeof experienceLevels[number];
export type GameInterval = 'weekly' | 'biweekly' | 'monthly' | 'yearly' | 'custom';
export type GMInterest = 'no' | 'maybe' | 'yes';
export type GameRegStatus = 'approved' | 'rejected' | 'pending' | 'banned';
export type LocationType = 'vtt' | 'discord' | 'physical';
export type DeliveryStatus = 'pending' | 'sent' | 'failed';
export type DeliveryMethod = 'email' | 'sms' | 'both';

/* DO Types */
export type ContactListDO = {
  id: string;
  given_name: string;
  surname: string;
}
export type MemberDO = {
  id: string;
  provider?: string;
  given_name: string;
  surname: string;
  displayName: string;
  email: string;
  phone: string;
  birthday?: Date | null;
  isMinor: boolean;
  isAdmin: boolean;
  experienceLevel?: ExperienceLevel;
  bio?: string;
  avatar: string;
  roles: RoleDO[];
  created_at?: Date;
  updated_at?: Date;
  onManageRoles?: (member: MemberDO) => void; // Optional callback to manage roles
  onRemoveMember?: (id: string, displayName: string) => void; // Optional callback to remove a member
  onResetPassword?: (email: string) => void; // Optional callback to reset the member's password
}
export type MessageUserDO = {
  id: string;
  given_name: string;
  surname: string;
}
export type MessageDO = {
  id: string;
  sender_id: string;
  sender: MessageUserDO;
  recipient_id: string;
  recipient: MessageUserDO;
  content: string;
  subject: string;
  is_read: boolean;
  is_archived: boolean;
  created_at: string;
  onDelete?: (id: string) => void;
  onArchive?: (id: string) => void;
  onMarkRead?: (id: string) => void;
  onReply?: (message: MessageDO) => void;
  onForward?: (message: MessageDO) => void;  
}
export type RoleDO = {
  id: string;
  name: string;
}

/* Supabase Support Types */
export type TypedSupabaseClient = SupabaseClient<Database>
export type Provider = 'google' | 'discord';
type SupabaseDataResponse<T> = {
  error: QueryError | null;
  data: T[];
  count: number | null;
  status: number;
  statusText: string;
}
type SupabaseDataResponseSingle<T> = {
  error: QueryError | null;
  data: T;
  count: number | null;
  status: number;
  statusText: string;
}

/* Supabase Query Responses */
export type ContactListData = {
  id: string;
  profiles: ProfileData;
}
export type SupabaseContactListResponse = SupabaseDataResponse<ContactListData>

export type EmailInvite = {
  email: string;
  given_name: string;
  surname: string;
  is_minor: boolean;
}

export type GameFavorite = {
  game_id: string;
  member_id: string;
  created_at: Date;
}
export type SupabaseGameFavoriteListResponse = SupabaseDataResponse<GameFavorite>

export type GameRegistration = {
  game_id: string;
  member_id: string;
  status: GameRegStatus;
  status_note: string;
  registered_at: Date;
  members: MemberData;  
}
export type SupabaseGameRegistrationListResponse = SupabaseDataResponse<GameRegistration>

export type MemberData = {
  id: string;
  email: string;
  phone?: string;
  provider?: string;
  is_admin: boolean;
  is_minor: boolean;
  created_at: Date;
  updated_at: Date;
  profiles: ProfileData;
  member_roles: RoleData[];
}
export type SupabaseMemberResponse = SupabaseDataResponseSingle<MemberData>
export type SupabaseMemberListResponse = SupabaseDataResponse<MemberData>

export type MessageData = {
  id: string;
  sender_id: string;
  sender: MemberData;
  recipient_id: string;
  recipient: MemberData;
  content: string;
  subject: string;
  is_read: boolean;
  is_archived: boolean;
  created_at: string;
}
export type SupabaseMessageListResponse = SupabaseDataResponse<MessageData>
export type SupabaseMessageResponse = SupabaseDataResponseSingle<MessageData>


export type ProfileData = {
  id?: string;
  given_name: string | null;
  surname: string | null;
  birthday: string | null;
  phone: string | null;
  bio: string | null;
  avatar: string | null;
  experience_level: ExperienceLevel;
}
export type SupabaseProfileResponse = SupabaseDataResponseSingle<ProfileData>

export type RoleData = {
  roles: RoleDO;
}
export type SupabaseRoleListResponse = SupabaseDataResponse<RoleData>
export type SupbaseRoleResponse = SupabaseDataResponseSingle<RoleData>

export type BroadcastRecipient = {
  id: string;
  message_id: string;
  recipient_id: string;
  members: MemberData;
  error_message: string;
  created_at: Date;
  updated_at: Date;
  delivery_method: DeliveryMethod;
  delivery_status: DeliveryStatus;
}
export type SupabaseBroadcastRecipientListResponse = SupabaseDataResponse<BroadcastRecipient>
export type SupabaseBroadcastRecipientResponse = SupabaseDataResponseSingle<BroadcastRecipient>

export type BroadcastMessage = {
  id: string;
  sender_id: string;
  game_id: string;
  subject: string;
  message: string;
  created_at: Date;
  mode: DeliveryMethod;
}
export type SupabaseBroadcastMessageListResponse = SupabaseDataResponse<BroadcastMessage>;
export type SupabaseBroadcastMessageResponse = SupabaseDataResponseSingle<BroadcastMessage>;

export type RegisteredGame = {
  id: string;
  title: string;
  description: string;
  system: string;
  scheduled_for: Date | null;
  status: string;
  registration_date: Date | null;
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
  image: string;
  scheduled_for: Date | null;
  status: string;
  num_players: number;
  max_seats: number;
  gm_name: string;
  gm_member_id: string;
  registered: boolean;
  registration_status: GameRegStatus;
  registration_date: Date | null;  
}

export type GameData = {
  id: string;
  game_id: string;
  status: GameStatus;
  interval: GameInterval;
  firstGameDate: Date; // or Date if you convert the date
  nextGameDate: Date;
  location_id: string;
  location: Location;
  dayOfWeek: DOW;
  title: string;
  description: string;
  system: string;
  image: string;
  maxSeats: number;
  currentSeats: number;
  startingSeats: number;
  favorite: boolean;
  registered: boolean;
  pending: boolean;
  favoritedBy: GameFavorite[];
  registrations: GameRegistration[];
  gamemaster_id: string;
  gm_given_name: string;
  gm_surname: string;
}

export type SupaGameScheduleData = {
  id: string;
  game_id: string;
  interval: GameInterval;
  day_of_week: DOW;
  first_game_date: Date; // or Date if you convert the date
  next_game_date: Date; // or Date if you convert the date
  last_game_date: Date; // or Date if you convert the date
  status: GameStatus;
  location_id: string;
  location: Location;
  games: SupaGameData;
}

export type SupaGameData = {
  id: string;
  title: string;
  description: string;
  system: string;
  image: string;
  max_seats: number;
  starting_seats: number;
  gamemaster_id: string;
  gamemaster: MemberData;
  registrants: GameRegistration[];
}

export type SupabaseGameDataResponse = SupabaseDataResponseSingle<SupaGameScheduleData>
export type SupabaseGameDataListResponse = SupabaseDataResponse<SupaGameScheduleData>
export type SupabaseUpcomingGamesListResponse = SupabaseDataResponse<GameData>

export type SupaGMGameData = {
  id: string;
  title: string;
  description: string;
  system: string;
  image: string;
  max_seats: number;
  starting_seats: number;
  game_schedule: SupaGameScheduleData[];
}
export type SupabaseGMGameDataResponse = SupabaseDataResponseSingle<SupaGMGameData>
export type SupabaseGMGameDataListResponse = SupabaseDataResponse<SupaGMGameData>

export type GMGameData = {
  id: string;
  title: string;
  description: string;
  system: string;
  scheduled_next: Date;
  interval: GameInterval;
  dow: DOW;
  maxSeats: number;
  status: GameStatus;
  location_id: string;
  location: Location;
  pending: number;
  registered: number;
  onShowDetails?: (game: GMGameData) => void;
  onEditGame?: (game: GMGameData) => void;
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
  gamemasterInterest: GMInterest;
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
  isMinor: boolean;
  experienceLevel: ExperienceLevel;
}

export type Player = {
  id: string;
  status: GameRegStatus;
  statusNote: string;
  email: string;
  phoneNumber: string;
  given_name: string;
  surname: string;
  avatar: string;
  isMinor: boolean;
  experienceLevel: ExperienceLevel;
  status_icon?: string;
  onApprove?: () => void;
  onKick?: () => void;
  onSendMessage?: () => void;
  onPlayerView?: () => void;
}

export type GameRegistrationData = {
  member_id: string;
  registered_at: Date;
  members: MemberData;
  profiles: ProfileData;
}

export type GameScheduleWithRegistrantsData = {
  id: string;
  game_id: string;
  interval: string;
  day_of_week: string;
  first_game_date: Date;
  next_game_date: Date;
  last_game_date: Date;
  status: string;
  games: GameData;
  game_registrations: GameRegistrationData[];
};


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

export type Location = {
  id: string;
  name: string;
  url?: string;
  address?: string;
  type: LocationType;
  created_at: Date;
  updated_at: Date;
}