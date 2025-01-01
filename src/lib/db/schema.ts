import { pgTable, pgEnum, unique, index, foreignKey, text, date, uuid, boolean, timestamp, integer, primaryKey } from 'drizzle-orm/pg-core';
import { InferInsertModel, InferSelectModel, sql } from 'drizzle-orm';

export const genRandomUuid = sql`gen_random_uuid()` as unknown as string;
export const now = sql`now()` as unknown as Date;

export const appFunctionEnum = pgEnum('app_function', ['games', 'members', 'schedules', 'messages']);
export const appPermissionEnum = pgEnum('app_permission', ['create', 'read', 'update', 'delete']);
export const dayOfWeekEnum = pgEnum('day_of_week_enum', ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']);
export const experienceLevelEnum = pgEnum('experience_level_enum', ['new', 'novice', 'seasoned', 'player-gm', 'forever-gm']);
export const gameIntervalEnum = pgEnum('game_interval_enum', ['weekly', 'biweekly', 'monthly', 'yearly', 'custom']);
export const gameStatusEnum = pgEnum('game_status_enum', ['draft', 'active', 'awaiting-players', 'full', 'scheduled', 'canceled', 'completed']);
// export const memberStatusEnum = pgEnum('member_status_enum', ['active', 'banned', 'inactive']);
// export const messageStatusEnum = pgEnum('message_status_enum', ['sent', 'read', 'archived']);
export const gamemasterInterestEnum = pgEnum('gamemaster_interest_enum', ['yes', 'no', 'maybe']);   
export const registrantStatusEnum = pgEnum('registrant_status_enum', ['banned', 'approved', 'rejected', 'pending']);

export const contacts = pgTable("contacts", {
    id: uuid("id").notNull().default(genRandomUuid).primaryKey(),
    first_name: text("first_name").notNull(),
    surname: text("surname").notNull(),
    email: text("email").notNull().unique(),
    phone_number: text("phone_number").notNull(),
    is_minor: boolean("is_minor").notNull(),
    parent_first_name: text("parent_first_name"),
    parent_surname: text("parent_surname"),
    parent_phone: text("parent_phone"),
    parent_email: text("parent_email"),
    experience_level: experienceLevelEnum("experience_level").notNull().default('new'),
    gamemaster_interest: gamemasterInterestEnum("gamemaster_interest").notNull().default('no'),
    preferred_system: text("preferred_system").notNull(),
    availability: text("availability").notNull(),
    agree_to_rules: boolean("agree_to_rules").notNull(),
    created_at: timestamp("created_at").default(now),
    updated_at: timestamp("updated_at").default(now)
});

export type InsertContact = InferInsertModel<typeof contacts>;
export type SelectContact = InferSelectModel<typeof contacts>;

export const game_favorites = pgTable("game_favorites", {
    created_at: timestamp("created_at").notNull().default(now),
    game_id: uuid("game_id").notNull().default(genRandomUuid),
    member_id: uuid("member_id").notNull().default(genRandomUuid)
}, (table) => [
        primaryKey({ columns: [table.game_id, table.member_id] }),
        foreignKey({
            name: "game_favorites_games_id_fkey",
            columns: [table.game_id],
            foreignColumns: [games.id]
        }),
        foreignKey({
            name: "game_favorites_member_id_fkey",
            columns: [table.member_id],
            foreignColumns: [members.id]
        })
]);
export type InsertGameFavorite = InferInsertModel<typeof game_favorites>;
export type SelectGameFavorite = InferSelectModel<typeof game_favorites>;

export const game_registrations = pgTable("game_registrations", {
    id: uuid("id").notNull().default(genRandomUuid).primaryKey(),
    member_id: uuid("member_id").notNull(),
    game_id: uuid("game_id").notNull(),
    registered_at: timestamp("registered_at").notNull().default(now),
    status: registrantStatusEnum("status").notNull().default('pending'),
    status_note: text("status_note"),
    updated_by: uuid("updated_by")
}, (table) => [
    foreignKey({
        name: "fk_game_registrations_games",
        columns: [table.game_id],
        foreignColumns: [games.id]
    }),
    foreignKey({
        name: "fk_game_registrations_members",
        columns: [table.member_id],
        foreignColumns: [members.id]
    }),
    foreignKey({
        name: "fk_game_registrations_updated_by",
        columns: [table.updated_by],
        foreignColumns: [members.id]
    })
]);
export type InsertGameRegistration = InferInsertModel<typeof game_registrations>;
export type SelectGameRegistration = InferSelectModel<typeof game_registrations>;

export const game_schedule = pgTable("game_schedule", {
    id: uuid("id").notNull().default(genRandomUuid).primaryKey(),
    game_id: uuid("game_id"),
    status: gameStatusEnum("status").notNull().default('draft'),
    interval: gameIntervalEnum("interval").notNull().default('weekly'),
    first_game_date: timestamp("first_game_date").notNull(),
    next_game_date: timestamp("next_game_date"),
    last_game_date: timestamp("last_game_date"),
    created_at: timestamp("created_at").default(now),
    updated_at: timestamp("updated_at").default(now),
    day_of_week: dayOfWeekEnum("day_of_week").default('sunday'),
    deleted_at: timestamp("deleted_at"),
    location: text("location")
}, (table) => [
    index("idx_game_schedule_deleted_at").on(table.deleted_at),
    foreignKey({
        name: "fk_game_schedule_games",
        columns: [table.game_id],
        foreignColumns: [games.id]
    })
]);
export type InsertGameSchedule = InferInsertModel<typeof game_schedule>;
export type SelectGameSchedule = InferSelectModel<typeof game_schedule>;

export const games = pgTable("games", {
    id: uuid("id").notNull().default(genRandomUuid).primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    system: text("system"),
    max_seats: integer("max_seats").default(0),
    gamemaster_id: uuid("gamemaster_id"),
    created_at: timestamp("created_at").default(now),
    deleted_at: timestamp("deleted_at"),
    updated_at: timestamp("updated_at").notNull().default(now),
    image: text("image").notNull().default('default'),
    starting_seats: integer("starting_seats").default(0)
}, (table) => [
    index("idx_games_deleted_at").on(table.deleted_at),
    foreignKey({
        name: "fk_games_gamemasters",
        columns: [table.gamemaster_id],
        foreignColumns: [members.id]
    })
]);
export type InsertGame = InferInsertModel<typeof games>;
export type SelectGame = InferSelectModel<typeof games>;

export const members = pgTable("members", {
    id: uuid("id").notNull().default(genRandomUuid).primaryKey(),
    email: text("email").notNull().unique(),
    phone: text("phone"),
    provider: text("provider").notNull(),
    created_at: timestamp("created_at").default(now),
    is_admin: boolean("is_admin").notNull().default(false),
    is_minor: boolean("is_minor").notNull().default(false),
    updated_at: timestamp("updated_at"),
    deleted_at: timestamp("deleted_at"),
    deleted_by: uuid("deleted_by")
}, (table) => [
    index("idx_members_deleted_at").on(table.deleted_at),
    foreignKey({
        name: "fk_members_deleted_by",
        columns: [table.deleted_by],
        foreignColumns: [table.id]
    })   
]);
export type InsertMember = InferInsertModel<typeof members>;
export type SelectMember = InferSelectModel<typeof members>;

export const member_roles = pgTable("member_roles", {
    id: uuid("id").notNull().default(genRandomUuid).primaryKey(),
    member_id: uuid("member_id").notNull(),
    role_id: uuid("role_id").notNull(),
    assigned_at: timestamp("assigned_at").notNull().default(now)
}, (table) => [
    unique().on(table.member_id, table.role_id),
    foreignKey({
        name: "fk_member_roles_members",
        columns: [table.member_id],
        foreignColumns: [members.id]
    }),
    foreignKey({
        name: "fk_member_roles_roles",
        columns: [table.role_id],
        foreignColumns: [roles.id]
    })
]);
export type InsertMemberRole = InferInsertModel<typeof member_roles>;
export type SelectMemberRole = InferSelectModel<typeof member_roles>;

export const messages = pgTable("messages", {
    id: uuid("id").notNull().default(genRandomUuid).primaryKey(),
    created_at: timestamp("created_at").notNull().default(now),
    sender_id: uuid("sender_id").notNull(),
    recipient_id: uuid("recipient_id").notNull(),
    content: text("content").notNull(),
    is_read: boolean("is_read").notNull().default(false),
    is_archived: boolean("is_archived").notNull().default(false),
    deleted_at: timestamp("deleted_at"),
    subject: text("subject")
}, (table) => [
    index("idx_messages_recipient_id").on(table.recipient_id),
    index("idx_messages_sender_id").on(table.sender_id),
    foreignKey({
        name: "messages_sender_id_fkey",
        columns: [table.sender_id],
        foreignColumns: [members.id]
    }),
    foreignKey({
        name: "messages_recipient_id_fkey",
        columns: [table.recipient_id],
        foreignColumns: [members.id]
    })
]);
export type InsertMessage = InferInsertModel<typeof messages>;
export type SelectMessage = InferSelectModel<typeof messages>;

export const profiles = pgTable("profiles", {
    id: uuid("id").notNull().primaryKey(),
    given_name: text("given_name"),
    surname: text("surname"),
    birthday: date("birthday"),
    created_at: timestamp("created_at").default(now),
    phone: text("phone"),
    bio: text("bio"),
    avatar: text("avatar"),
    updated_at: timestamp("updated_at"),
    experience_level: text("experience_level").notNull().default('new')
}, (table) => [
    foreignKey({
        name: "fk_profiles_members",
        columns: [table.id],
        foreignColumns: [members.id]
    })
]);
export type InsertProfile = InferInsertModel<typeof profiles>;
export type SelectProfile = InferSelectModel<typeof profiles>;

export const role_permissions = pgTable("role_permissions", {
    id: text("id").notNull().primaryKey(),
    role_id: uuid("role_id").notNull(),
    function: appFunctionEnum("function").notNull(),
    permission: appPermissionEnum("permission").notNull()
}, (table) => [
    unique().on(table.role_id, table.function, table.permission),
    foreignKey({
        name: "fk_role_permissions_roles",
        columns: [table.role_id],
        foreignColumns: [roles.id]
    })
]);

export const roles = pgTable("roles", {
    id: uuid("id").notNull().default(genRandomUuid).primaryKey(),
    name: text("name").notNull().unique(),
});