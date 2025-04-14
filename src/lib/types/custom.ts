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
export const DaysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
export type DOW = (typeof DaysOfWeek)[number];
export const GAME_STATUS = ['active', 'planning', 'paused', 'canceled', 'completed'] as const;
export type GameStatus = (typeof GAME_STATUS)[number];
export const GAME_SCHED_STATUS = ['draft', 'active', 'paused', 'scheduled', 'completed', 'awaiting-players', 'full', 'canceled'] as const;
export type GameSchedStatus = (typeof GAME_SCHED_STATUS)[number];
export const experienceLevels = ['new', 'novice', 'seasoned', 'player-gm', 'forever-gm'] as const;
export type ExperienceLevel = typeof experienceLevels[number];
export const GAME_INTERVALS = ['weekly', 'biweekly', 'monthly', 'yearly', 'custom'] as const;
export type GameInterval = (typeof GAME_INTERVALS)[number];
export const GM_INTERESTS = ['no', 'maybe', 'yes'] as const;
export type GMInterest = (typeof GM_INTERESTS)[number];
export const GAME_REG_STATUSES = ['approved', 'rejected', 'pending', 'banned'] as const;
export type GameRegStatus = (typeof GAME_REG_STATUSES)[number];
export const LOCATION_TYPES = ['vtt', 'discord', 'physical'] as const;
export type LocationType = (typeof LOCATION_TYPES)[number];
export const DELIVERY_STATUSES = ['pending', 'sent', 'failed'] as const;
export type DeliveryStatus = (typeof DELIVERY_STATUSES)[number];
export const DELIVERY_METHODS = ['email', 'sms', 'both'] as const;
export type DeliveryMethod = (typeof DELIVERY_METHODS)[number];
export const LOCATION_SCOPES = ['admin', 'gm', 'disabled'] as const;
export type LocationScope = (typeof LOCATION_SCOPES)[number];
export const GAME_VISIBILITY= ['public', 'private'] as const;
export type GameVisibility = (typeof GAME_VISIBILITY)[number];
export const AUDIENCES = ['public', 'members', 'gamemasters', 'admins'] as const;
export type Audience = (typeof AUDIENCES)[number];
export const MESSAGE_CATEGORIES = ['admin', 'announcement', 'general', 'gm', 'invite', 'support'] as const;
export type MessageCategory = (typeof MESSAGE_CATEGORIES)[number];
export const TASK_STATUSES = ['pending', 'in_progress', 'complete', 'archived'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];
export const TASK_PRIORITIES = ['low', 'medium', 'high', 'critical'] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];
export const MEMBER_STATUSES = ['active', 'inactive', 'pending', 'banned'] as const;
export type MemberStatus = (typeof MEMBER_STATUSES)[number];
export const INVITE_STATUSES = ['pending', 'accepted', 'expired', 'declined'] as const;
export type InviteStatus = (typeof INVITE_STATUSES)[number];
export const NOTE_TARGET_TYPE = ['member', 'game'] as const;
export type NoteTargetType = (typeof NOTE_TARGET_TYPE)[number];
export const AUDIT_ACTION = ["create", "update", "delete", "accept", "login", "system"] as const;
export type AuditAction = (typeof AUDIT_ACTION)[number];
export const FEEDBACK_CATEGORIES = ['bug', 'feature', 'praise', 'other'] as const;
export type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number];
export const RESOURCE_CATEGORIES = ['rules', 'lore', 'characters', 'map', 'external', 'misc'] as const;
export type ResourceCategory = (typeof RESOURCE_CATEGORIES)[number];
export const RESOURCE_VISIBILITY = ['admins', 'gamemasters', 'members', 'public'] as const;
export type ResourceVisibility = (typeof RESOURCE_VISIBILITY)[number];

/* DO Types */
export type AdminNoteDO = Omit<AdminNote, | 'updated_at' | 'deleted_at' | 'author'> & {
  edited_at: Date | null;
  author_email: string;
  author: {
    id: string,
    email: string,
    displayName: string;
  };
  onView?: (note: AdminNoteDO) => void;
}

export type AuditTrailDO = AuditTrailData;

export type ContactListDO = {
  id: string;
  given_name: string;
  surname: string;
}

export type AdminLocationDO = Location & {
  authorized_gamemasters: ContactListDO[];
}

export type AnnouncementDO = {
  id: string;
  title: string;
  body: string;
  audience: Audience;
  pinned: boolean;
  published: boolean;
  notify_on_publish: boolean;
  published_at: string | null;
  expires_at: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  author_id: string;
  approved_by: string | null;
}

export type GMGamePlayerDO = {
  member_id: string;
  game_id: string;
  registered_at: string;
  status: string;
  status_note: string | null;
  email: string | null;
  profiles: {
    given_name: string | null;
    surname: string | null;
  } | null;
};

export type GMGameDataDO = {
  id: string;
  title: string;
  system: string;
  status: string;
  gm_id: string | null;
  gm_name: string;
  player_count: number;
  next_session_at: string | null;
  deleted_at: string | null;
  created_at: string;
  search?: string;
  archived?: boolean;
}

export type GMLocationDO = Location & {
  authorized_gamemasters: ContactListDO[];
}
export type SupabaseGMLocationPermResponse = SupabaseDataResponseSingle<GMLocationDO>
export type SupabaseGMLocationPermListResponse = SupabaseDataResponse<GMLocationDO>


export type InviteDO = {
    id: string;
    display_name: string;
    email: string | null;
    invited_at: string;
    expires_at: string;
    accepted_at: string | null;
    accepted: boolean;
    notified: boolean;
    game_title: string;
    gm_name: string;  
    search?: string;
    status?: string;
}

export type InvitedPlayer = {
  id?: string;
  provider?: string;
  given_name: string;
  surname: string;
  displayName: string;
  email?: string;
  phone?: string;
  expires_in_days?: number;
  expires_at?: string;
}

export type MemberDO = {
  status: MemberStatus;
  last_login_at: Date | null;
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
  consent: boolean;
  experienceLevel?: ExperienceLevel;
  bio?: string;
  avatar: string;
  roles: RoleDO[];
  created_at: Date;
  updated_at: Date;
  updated_by: string;
  deleted_at: Date | null;
  deleted_by: string;
  admin_notes?: AdminNote[] | null;
  search?: string;
  last_login_before?: Date;
  last_login_after?: Date;
  onManageRoles?: (member: MemberDO) => void; // Optional callback to manage roles
  onRemoveMember?: (id: string, displayName: string) => void; // Optional callback to remove a member
  onResetPassword?: (email: string) => void; // Optional callback to reset the member's password
}
export type MessageUserDO = {
  id: string;
  given_name: string;
  surname: string;
}
export type MessageDO = Omit<MessageData, "sender" | "recipient"> & {
  sender: MessageUserDO;
  recipient: MessageUserDO;
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

export interface Announcement {
  id: string;
  title: string;
  body: string;
  audience: Audience;
  pinned: boolean;
  published: boolean;
  notify_on_publish: boolean;
  published_at: string | null;
  expires_at: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  author_id: string;
  approved_by: string | null;
}

export interface AnnouncementRead {
  announcement_id: string;
  member_id: string;
  read_at: string;
}

export type SupabaseAnnouncementListResponse = SupabaseDataResponse<Announcement>
export type SupabaseAnnouncementResponse = SupabaseDataResponseSingle<Announcement>

export type AuditTrailData = {
  id: string;
  action: AuditAction;
  actor_id: string | null;
  target_type: string;
  target_id: string;
  summary: string | null;
  metadata: Record<string, any> | null;
  created_at: string;
  actor?: MemberData;
}

export type ContactListData = {
  id: string;
  member_roles?: RoleData[];
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

export type AdminNote = {
  id: string;
  author_id: string;
  author: MemberData;
  target_id: string;
  target_type: NoteTargetType;
  note: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}
export type SupabaseAdminNoteListResponse = SupabaseDataResponse<AdminNote>
export type SupabaseAdminNoteResponse = SupabaseDataResponseSingle<AdminNote>

export type MemberData = {
  id: string;
  email: string;
  phone?: string;
  provider?: string;
  is_admin: boolean;
  is_minor: boolean;
  consent: boolean;
  status: MemberStatus;
  last_login_at: Date | null;
  created_at: Date;
  updated_at: Date;
  updated_by: string;
  deleted_at: Date;
  deleted_by: string;
  admin_notes: AdminNote[] | null;
  profiles: ProfileData;
  member_roles: RoleData[];
}
export type SupabaseMemberResponse = SupabaseDataResponseSingle<MemberData>
export type SupabaseMemberListResponse = SupabaseDataResponse<MemberData>

export interface CreateMessage {
  sender_id: string;
  recipient_id: string;
  subject: string;
  content: string;
  category: MessageCategory;
  link_url: string;
}

export type MessageData = {
  id: string;
  sender_id: string;
  sender: MemberData;
  recipient_id: string;
  recipient: MemberData;
  content: string;
  subject: string;
  category: MessageCategory;
  link_url: string;
  is_read: boolean;
  is_archived: boolean;
  created_at: string;
}
export type SupabaseMessageListResponse = SupabaseDataResponse<MessageData>
export type SupabaseMessageResponse = SupabaseDataResponseSingle<MessageData>

export type GMGameSummary = {
  id: string;
  title: string;
  status: GameStatus;
  system: string;
  starting_seats: number;
  visibility: GameVisibility;
  max_seats: number;
  gamemaster_id: string;
  gamemaster: MemberData;
  game_registrations: { count: number }
  game_schedules: GameSchedule;
}
export type SupabaseGMGameSummaryListResponse = SupabaseDataResponse<GMGameSummary>
export type SupabaseGMGameSummaryResponse = SupabaseDataResponseSingle<GMGameSummary>

export type GMGameSummaryDO = Omit<GMGameSummary, "starting_seats" | "max_seats" | "game_registrations" | "game_schedules" | "starting_seats" | "gamemaster" | "gamemaster_id"> & {
  startingSeats: number;
  playerCount: number;
  playerLimit: number;
  gamemaster: {
    id: string;
    email: string;
    displayName: string
  }
  schedules: GameSchedule;
}

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

export type RegisteredGameDO = {
  id: string;
  title: string;
  description: string;
  system: string;
  visibility: GameVisibility
  coverImage: string;
  scheduled_for: Date | null;
  location: Location;
  status: GameSchedStatus;
  interval: GameInterval;
  dayOfWeek: DOW;
  gamemasterId: string;
  gm_given_name: string;
  gm_surname: string;
}

export type TagData = { 
  id: string; 
  name: string, 
  admin_task_tags: AdminTaskTagData[]
}
export type SupabaseTagListResponse = SupabaseDataResponse<TagData>
export type SupabaseTagResponse = SupabaseDataResponseSingle<TagData> 

export type TagDO = Omit<TagData, "admin_task_tags"> & {
  task_count: number;
}

export interface TaskData {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null; // ISO date string
  created_by: string;
  assigned_to: string | null;
  assigned_to_user: MemberData | null;
  admin_task_tags: AdminTaskTagData[]; // array of tag(tag_id),
  tags: TagData[]; // array of tag(name)
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type AdminTaskTagData = { 
  task_id: string;
  tag_id: string;
  count?: number  
}

export type FeedbackDO = Omit<FeedbackData, "member" | "handler"> & {
  member: {
    id: string;
    given_name: string | null;
    surname: string | null;
    displayName: string | null;
  }
  handler: {
    id: string;
    given_name: string | null;
    surname: string | null;
    displayName: string | null;
  }
}

export type FeedbackData = {
  id: string;
  message: string;
  category: FeedbackCategory;
  submitted_at: string;
  handled: boolean;
  handled_at: string | null;
  handled_by: string | null;
  handler: MemberData;
  member_id: string;
  member: MemberData;
}
export type SupabaseFeedbackListResponse = SupabaseDataResponse<FeedbackData>
export type SupabaseFeedbackResponse = SupabaseDataResponseSingle<FeedbackData>

export type GameResourceDO = GameResourceData;
export type GameResourceData = {
  id: string;
  title: string;
  body: string;
  category: ResourceCategory;
  visibility: ResourceVisibility;
  external_url?: string;
  file_url?: string;
  author_id: string;
  pinned: boolean;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
  deleted_by: string | null;
}

export type GMGameScheduleDO = {
  interval: GameInterval;
  status: GameSchedStatus;
  first_game_date: string;
  next_game_date: string;
  last_game_date: string | null;
  day_of_week: DOW;
}


export type TaskDO = Omit<TaskData, "assigned_to" | "assigned_to_user" | "created_at" | "updated_at" | "deleted_at"> & {
  assigned_to: {
    id: string | null;
    given_name: string | null;
    surname: string | null;
    displayName: string | null;
  }
}
export type SupabaseTaskListResponse = SupabaseDataResponse<TaskData>
export type SupabaseTaskResponse = SupabaseDataResponseSingle<TaskData>

export type UpcomingGame = {
  id: string;
  title: string;
  description: string;
  system: string;
  coverImage: string;
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

export type GameData = {
  id: string;
  game_id: string;
  status: GameSchedStatus;
  interval: GameInterval;
  firstGameDate: Date; // or Date if you convert the date
  nextGameDate: Date;
  location_id: string;
  location: Location;
  dayOfWeek: DOW;
  visibility: GameVisibility;
  title: string;
  description: string;
  system: string;
  coverImage: string;
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
  status: GameSchedStatus;
  location_id: string;
  location: Location;
  games: SupaGameData;
}

export type SupaGameData = {
  id: string;
  title: string;
  description: string;
  system: string;
  cover_image: string;
  max_seats: number;
  visibility: GameVisibility;
  starting_seats: number;
  gamemaster_id: string;
  gamemaster: MemberData;
  registrants: GameRegistration[];
}

export type SupabaseGameDataResponse = SupabaseDataResponseSingle<SupaGameScheduleData>
export type SupabaseGameDataListResponse = SupabaseDataResponse<SupaGameScheduleData>
export type SupabaseUpcomingGamesListResponse = SupabaseDataResponse<GameData>

export type GMGameDO = SupaGMGameData
export type GMGameDataResponse = SupabaseDataResponseSingle<GMGameDO>
export type GMGameDataListResponse = SupabaseDataResponse<GMGameDO>

export type SupaGMGameData = {
  id: string;
  title: string;
  description: string;
  system: string;
  status: GameStatus;
  game_code: string;
  cover_image: string;
  max_seats: number;
  starting_seats: number;
  visibility: GameVisibility;
  game_schedule: SupaGameScheduleData[];
  gamemaster: MemberData;
  created_at: Date;
  deleted_at: Date | null;
  game_registrations: GameRegistration[];
}
export type SupabaseGMGameDataResponse = SupabaseDataResponseSingle<SupaGMGameData>
export type SupabaseGMGameDataListResponse = SupabaseDataResponse<SupaGMGameData>

export type GMGameData = {
  id: string;
  title: string;
  description: string;
  system: string;
  coverImage: string;
  scheduled_next: Date;
  interval: GameInterval;
  dow: DOW;
  maxSeats: number;
  status: GameSchedStatus;
  location_id: string;
  location: Location;
  visibility: GameVisibility;
  invites: number;
  pending: number;
  registered: number;
  gamemaster: MemberData;
  onShowDetails?: (game: GMGameData) => void;
  onEditGame?: (game: GMGameData) => void;
}

export type SupabaseLocationResponse = SupabaseDataResponseSingle<Location>
export type SupabaseLocationListResponse = SupabaseDataResponse<Location>

export type Location = {
  id: string;
  name: string;
  url?: string;
  address?: string;
  type: LocationType;
  created_at: Date;
  updated_at: Date;
  created_by: string;
  scope: LocationScope;
}

export type LocationData = 
  Location & {
    location_perms: LocationPermData[];
  }

export type LocationPerm = {
  id: string;
  location_id: string;
  gamemaster_id: string;  
}

export type LocationPermData = LocationPerm & {
  members: MemberData
}

export type SupabaseAdminLocationPermResponse = SupabaseDataResponseSingle<LocationData>
export type SupabaseAdminLocationPermListResponse = SupabaseDataResponse<LocationData>

export type SupabaseLocationPermResponse = SupabaseDataResponseSingle<LocationPermData>
export type SupabaseLocationPermListResponse = SupabaseDataResponse<LocationPermData>

export type InviteData = {
  id: string;
  game_id: string;
  invitee: string;
  invited_at: Date;
  accepted: boolean;
  accepted_at: Date | null;
  expires_at: Date | null;
  viewed_at: Date | null;
  notified: boolean;
  gamemaster_id: string;
  display_name: string;
  external_email?: string;
  external_phone?: string;
  game: GameData;
  gamemaster: MemberData;
}

export type SupabaseGameInviteResponse = SupabaseDataResponseSingle<InviteData>
export type SupabaseGameInviteListResponse = SupabaseDataResponse<InviteData>

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
  status: GameSchedStatus;
}

export type GMAnalytics = {
  totalGames: number;
  activeGames: number;
  upcomingSessions: number;
  totalPlayers: number;
  inviteStats: InviteStat[];
  registrationStatus: RegistrationStatus;
}

export type RegistrationStatus = {
  approved: number;
  pending: number;
  rejected: number;
  banned: number;
}

export type InviteStat = {
  gameId: string;
  gameTitle: string;
  accepted: number;
  total: number;
}

export type GMSessionNoteDO = {
  id: string;
  game_id: string;
  schedule_id: string;
  author_id: string;
  session_date: string;
  title: string;
  body: string;
  is_visible_to_players: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type GMLocationResponse = {
  data: GMLocationDO[];
  total: number;
  page: number;
  pageSize: number;
};

export const CONTACT_CATEGORIES = ['general', 'bug report', 'feature request', 'support', 'question', 'feedback', 'other'] as const;
export type ContactCategory = typeof CONTACT_CATEGORIES[number];
export type ContactData = {
    name: string;
    email: string;
    category: ContactCategory;
    message: string;
    website?: string;
}
