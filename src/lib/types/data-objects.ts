import { AdminNote, Audience, AuditTrailData, ExperienceLevel, MemberStatus, MessageData, Location, DOW, GameInterval, GameSchedStatus, GameStatus, GameVisibility, MemberData, GMGameSummary, GameSchedule } from "./custom";

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

export type GMGameDO = {
  id: string;
  title: string;
  description: string;
  system: string;
  coverImage: string;
  gameCode: string;
  scheduled_next: Date;
  interval: GameInterval;
  dow: DOW;
  maxSeats: number;
  status: GameStatus;
  schedStatus: GameSchedStatus;
  location_id: string;
  location: Location;
  visibility: GameVisibility;
  invites: number;
  pending: number;
  registered: number;
  gamemaster: MemberData;
  onShowDetails?: (game: GMGameDO) => void;
  onEditGame?: (game: GMGameDO) => void;
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

export type GMGameScheduleDO = {
  game_id: string;
  game_title: string;
  game_cover_image: string;
  schedule_status: GameSchedStatus
  interval: GameInterval;
  first_game_date: string;
  next_game_date: string | null;
  last_game_date: string | null;
  day_of_week: DOW | null;
  location?: Location;
}

export type GMGameDataDO = {
  id: string;
  title: string;
  system: string;
  status: string;
  description: string;
  visibility: string;
  coverImage: string;
  location_id: string | null;
  location_name: string;
  maxSeats: number;
  startingSeats: number;
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

export type InviteDO = {
    id: string;
    game_id: string;
    invitee: string;
    display_name: string;
    email: string | null;
    phone: string | null;
    invited_at: string;
    expires_at: string | null;
    viewed_at: string | null;
    accepted_at: string | null;
    accepted: boolean;
    notified: boolean;
    game_title: string;
    gm_id: string;
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

export type UpcomingGameDO = {
  id: string;
  title: string;
  status: GameSchedStatus
  next_session_date: Date | string | null;
  location: Location;
}

export type ProfileSummaryDO = {
  avatar: string;
  given_name: string;
  surname: string;
  id: string;
  experience_level: ExperienceLevel;
  bio: string;
  created_at: Date;
}