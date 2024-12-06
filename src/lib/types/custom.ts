import { SupabaseClient, QueryError } from "@supabase/supabase-js";
import type { Database } from "./supabase";

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

type MessageUserDO = {
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

export type RoleData = {
  roles: RoleDO;
}

export type RoleDO = {
  id: string;
  name: string;
}

export type SupabaseRoleListResponse = SupabaseDataResponse<RoleData>

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

export type GameRegistration = {
  game_id: string;
  member_id: string;
  members: MemberData;  
}

export type EmailInvite = {
  email: string;
  given_name: string;
  surname: string;
  is_minor: boolean;
}

export type ContactListDO = {
  id: string;
  given_name: string;
  surname: string;
}

export type ContactListData = {
  id: string;
  profiles: ProfileData;
}

export type SupabaseContactListResponse = SupabaseDataResponse<ContactListData>

export type MemberData = {
  id: string;
  email: string;
  phone?: string;
  provider?: string;
  is_admin: boolean;
  is_minor: boolean;
  profiles: ProfileData;
  member_roles: RoleData[];
  onManageRoles?: (member: MemberData) => void;
  onRemoveMember?: (id: string, displayName: string) => void;
  onResetPassword?: (email: string) => void;
}

export type SupabaseMemberResponse = SupabaseDataResponseSingle<MemberData>
export type SupabaseMemberListResponse = SupabaseDataResponse<MemberData>

export type SupabaseGameRegistrationListResponse = SupabaseDataResponse<GameRegistration>

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
  scheduled_for: Date | null;
  status: string;
  num_players: number;
  gm_name: string;
  gm_member_id: string;
}

export type GameData = {
  id: string;
  game_id: string;
  status: GameStatus;
  interval: GameInterval;
  firstGameDate: Date; // or Date if you convert the date
  nextGameDate: Date; // or Date if you convert the date
  location: string;
  dayOfWeek: DOW;
  title: string;
  description: string;
  system: string;
  maxSeats: number;
  currentSeats: number;
  favorite: boolean;
  registered?: boolean;
  gamemaster_id: string;
  gm_given_name: string;
  gm_surname: string;
}

export type SupaGameScheduleData = {
  id: string;
  game_id: string;
  status: GameStatus;
  interval: GameInterval;
  first_game_date: Date; // or Date if you convert the date
  next_game_date: Date; // or Date if you convert the date
  location: string;
  day_of_week: DOW;
  games: SupaGameData;
}

export type SupaGameData = {
  id: string;
  title: string;
  description: string;
  system: string;
  max_seats: number;
  gamemaster_id: string;
  members: MemberData;
}
  

export type SupabaseGameDataListResponse = SupabaseDataResponse<SupaGameScheduleData>

export type SupabaseUpcomingGamesListResponse = SupabaseDataResponse<GameData>

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
  location: string;
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
  email: string;
  phoneNumber: string | null;
  givenName: string;
  surname: string;
  avatar: string | null;
  isMinor: boolean;
  experienceLevel: ExperienceLevel;
}

export type GameRegistrationData = {
  member_id: string;
  members: MemberData;
  profiles: ProfileData;
}

export type SupabaseGameScheduleWithRegistrantsData = {
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

export type DOW = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

export type GameStatus = 'draft' |'active' | 'scheduled' | 'completed' | 'awaiting-players' | 'full' | 'canceled';

export type ExperienceLevel = 'new' | 'novice' | 'seasoned' | 'player-gm' | 'forever-gm';

export type GameInterval = 'weekly' | 'biweekly' | 'monthly' | 'yearly' | 'custom';

export type GMInterest = 'no' | 'maybe' | 'yes';

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