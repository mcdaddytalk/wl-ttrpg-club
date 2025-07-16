import { SupabaseClient, QueryError } from "@supabase/supabase-js";
import type { Database } from "./supabase";
import { GMLocationDO, RoleDO } from "./data-objects";

/* ENUM Types */
export const ROLES = ['admin', 'gamemaster', 'member'] as const;
export type Role = (typeof ROLES)[number];
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
export const MESSAGE_CATEGORIES = ['admin', 'announcement', 'general', 'gm', 'invite', 'support', 'system', 'feedback', 'reminder'] as const;
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
  created_at: string;
}
export type SupabaseGameFavoriteListResponse = SupabaseDataResponse<GameFavorite>

export type GameRegistration = {
  game_id: string;
  member_id: string;
  status: GameRegStatus;
  status_note: string;
  registered_at: string;
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
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
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
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
  updated_by: string;
  deleted_at: string | null;
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
  preview: string;
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
  created_at: string;
  updated_at: string;
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
  created_at: string;
  mode: DeliveryMethod;
}
export type SupabaseBroadcastMessageListResponse = SupabaseDataResponse<BroadcastMessage>;
export type SupabaseBroadcastMessageResponse = SupabaseDataResponseSingle<BroadcastMessage>;

export type RegisteredGame = {
  id: string;
  title: string;
  description: string;
  system: string;
  scheduled_for: string | null;
  status: string;
  registration_date: string | null;
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
  scheduled_for: string | null;
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
  summary: string;
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
  scheduled_for: string | null;
  status: string;
  num_players: number;
  max_seats: number;
  gm_name: string;
  gm_member_id: string;
  registered: boolean;
  registration_status: GameRegStatus;
  registration_date: string | null;  
}

export type RegisteredCharacter = {
  id: string;
  name: string;
  description: string;
  system: string;
  registered_at: string;
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
  firstGameDate: string; // or string if you convert the date
  nextGameDate: string | null; // or string if you convert the date
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
  status: GameSchedStatus;
  interval: GameInterval;
  day_of_week: DOW;
  first_game_date: string; // or Date if you convert the date
  next_game_date: string | null; // or Date if you convert the date
  last_game_date: string | null; // or Date if you convert the date
  game_id: string;  
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

export type GMGameDataResponse = SupabaseDataResponseSingle<GMGameData>
export type GMGameDataListResponse = SupabaseDataResponse<GMGameData>

export type GMGameData = {
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
  gamemaster_id: string;
  gamemaster: MemberData;
  created_at: string;
  deleted_at: string | null;
  game_invites: InviteData[];
  game_registrations: GameRegistration[];
}

export type SupabaseGMLocationPermResponse = SupabaseDataResponseSingle<GMLocationDO>
export type SupabaseGMLocationPermListResponse = SupabaseDataResponse<GMLocationDO>

export type SupabaseLocationResponse = SupabaseDataResponseSingle<Location>
export type SupabaseLocationListResponse = SupabaseDataResponse<Location>

export type Location = {
  id: string;
  name: string;
  url?: string;
  address?: string;
  type: LocationType;
  created_at: string;
  updated_at: string;
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
  invitee_member?: MemberData;
  invited_at: string;
  accepted: boolean;
  status: InviteStatus;
  accepted_at: string | null;
  expires_at: string | null;
  viewed_at: string | null;
  notified: boolean;
  gamemaster_id: string;
  display_name: string;
  external_email?: string;
  external_phone?: string;
  games: GameData;
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
  first_game_date: string;
  next_game_date: string;
  last_game_date: string;
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
  registered_at: string;
  members: MemberData;
  profiles: ProfileData;
}

export type GameScheduleWithRegistrantsData = {
  id: string;
  game_id: string;
  interval: string;
  day_of_week: string;
  first_game_date: string;
  next_game_date: string;
  last_game_date: string;
  status: string;
  games: GameData;
  game_registrations: GameRegistrationData[];
};

export type SupaGameSchedule = {
  gm_id: string;
  game_id: string;
  interval: GameInterval;
  day_of_week: DOW;
  first_game_date: string;
  next_game_date: string;
  last_game_date?: string;
  status: GameSchedStatus;
  location_id: string;
  location: Location;
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

export const CONTACT_CATEGORIES = ['general', 'bug report', 'feature request', 'support', 'question', 'feedback', 'new contact', 'other'] as const;
export type ContactCategory = typeof CONTACT_CATEGORIES[number];
export type ContactData = {
    name: string;
    email: string;
    category: ContactCategory;
    message: string;
    website?: string;
}

type UpcomingGameData = {
  game_id: string;
  games: {
    id: string;
    title: string;
    game_schedule: SupaGameSchedule[];
  };
}

export type UpcomingGamesResponse = SupabaseDataResponse<UpcomingGameData>