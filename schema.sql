

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "pg_catalog";






CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."app_function" AS ENUM (
    'games',
    'members',
    'schedules',
    'messages'
);


ALTER TYPE "public"."app_function" OWNER TO "postgres";


CREATE TYPE "public"."app_permission" AS ENUM (
    'create',
    'read',
    'update',
    'delete'
);


ALTER TYPE "public"."app_permission" OWNER TO "postgres";


CREATE TYPE "public"."day_of_week_enum" AS ENUM (
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday'
);


ALTER TYPE "public"."day_of_week_enum" OWNER TO "postgres";


CREATE TYPE "public"."experience_level_enum" AS ENUM (
    'new',
    'novice',
    'seasoned',
    'player-gm',
    'forever-gm'
);


ALTER TYPE "public"."experience_level_enum" OWNER TO "postgres";


CREATE TYPE "public"."game_interval_enum" AS ENUM (
    'weekly',
    'biweekly',
    'monthly',
    'yearly',
    'custom'
);


ALTER TYPE "public"."game_interval_enum" OWNER TO "postgres";


CREATE TYPE "public"."game_status_enum" AS ENUM (
    'draft',
    'active',
    'scheduled',
    'awaiting-players',
    'full',
    'completed',
    'canceled'
);


ALTER TYPE "public"."game_status_enum" OWNER TO "postgres";


CREATE TYPE "public"."gamemaster_interest_enum" AS ENUM (
    'yes',
    'no',
    'maybe'
);


ALTER TYPE "public"."gamemaster_interest_enum" OWNER TO "postgres";


CREATE TYPE "public"."registrant_status_enum" AS ENUM (
    'banned',
    'approved',
    'rejected',
    'pending'
);


ALTER TYPE "public"."registrant_status_enum" OWNER TO "postgres";


COMMENT ON TYPE "public"."registrant_status_enum" IS 'Status of a pending player';



CREATE OR REPLACE FUNCTION "public"."custom_access_token_hook"("event" "jsonb") RETURNS "jsonb"
    LANGUAGE "plpgsql" STABLE
    AS $$
  declare
    claims jsonb;
    user_roles jsonb;
  begin
    -- Initialize claims from the event
    claims := event->'claims';

    -- Fetch all role names for the user from user_roles and roles table
    select coalesce(jsonb_agg(r.name), '[]'::jsonb) -- Ensure an empty array is returned if no roles found
    into user_roles
    from public.member_roles ur
    join public.roles r on ur.role_id = r.id
    where ur.member_id = (event->>'user_id')::uuid;

    -- Add roles to claims
    claims := jsonb_set(claims, '{roles}', user_roles);

    -- Update the 'claims' object in the original event
    event := jsonb_set(event, '{claims}', claims);

    -- Return the modified event
    return event;
  exception
    when others then
      -- Handle unexpected errors gracefully by returning the original event
      return event;
  end;
$$;


ALTER FUNCTION "public"."custom_access_token_hook"("event" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_scheduled_games_with_counts"("member_id" "uuid") RETURNS TABLE("game_id" "uuid", "game_name" "text", "description" "text", "system" "text", "gamemaster_id" "uuid", "gm_given_name" "text", "gm_surname" "text", "status" "text", "first_game_date" "date", "last_game_date" "date", "user_id" "uuid", "registered_at" "date", "num_players" integer)
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sgv.game_id,
    sgv.name::TEXT AS game_name,             -- Cast to TEXT
    sgv.description::TEXT AS description,    -- Cast to TEXT
    sgv.system::TEXT AS system,              -- Cast to TEXT
    sgv.gamemaster_id,
    sgv.gm_given_name::TEXT AS gm_given_name,-- Cast to TEXT
    sgv.gm_surname::TEXT AS gm_surname,      -- Cast to TEXT
    sgv.status::TEXT AS status,              -- Cast to TEXT
    sgv.first_game_date::DATE AS first_game_date,  -- Cast to DATE
    sgv.last_game_date::DATE AS last_game_date,    -- Cast to DATE
    sgv.member_id AS user_id,
    sgv.registered_at::DATE AS registered_at,
    COUNT(gr.member_id)::INTEGER AS num_players
  FROM public.scheduled_games_view sgv
  LEFT JOIN public.game_registrations gr 
    ON sgv.game_id = gr.game_id
  WHERE sgv.game_id IN (
    SELECT reg.game_id 
    FROM public.game_registrations reg 
    WHERE reg.member_id = get_scheduled_games_with_counts.member_id
  )
  GROUP BY 
    sgv.game_id,
    sgv.name,
    sgv.description,
    sgv.system,
    sgv.gamemaster_id,
    sgv.gm_given_name,
    sgv.gm_surname,
    sgv.status,
    sgv.first_game_date,
    sgv.last_game_date,
    sgv.member_id,
    sgv.registered_at
  ORDER BY sgv.first_game_date ASC;
END;
$$;


ALTER FUNCTION "public"."get_scheduled_games_with_counts"("member_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_upcoming_games_with_counts"("member_id" "uuid") RETURNS TABLE("game_id" "uuid", "game_name" "text", "description" "text", "system" "text", "gamemaster_id" "uuid", "gm_given_name" "text", "gm_surname" "text", "status" "text", "first_game_date" "date", "last_game_date" "date", "user_id" "uuid", "registered_at" "date", "num_players" integer)
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ugv.game_id,
    ugv.name::TEXT AS game_name,             -- Cast to TEXT
    ugv.description::TEXT AS description,    -- Cast to TEXT
    ugv.system::TEXT AS system,              -- Cast to TEXT
    ugv.gamemaster_id,
    ugv.gm_given_name::TEXT AS gm_given_name,-- Cast to TEXT
    ugv.gm_surname::TEXT AS gm_surname,      -- Cast to TEXT
    ugv.status::TEXT AS status,              -- Cast to TEXT
    ugv.first_game_date::DATE AS first_game_date,  -- Cast to DATE
    ugv.last_game_date::DATE AS last_game_date,    -- Cast to DATE
    ugv.member_id AS user_id,
    ugv.registered_at::DATE AS registered_at,
    COUNT(gr.member_id)::INTEGER AS num_players
  FROM public.upcoming_games_view ugv
  LEFT JOIN public.game_registrations gr 
    ON ugv.game_id = gr.game_id
  WHERE EXISTS (
    SELECT 1 
    FROM public.game_registrations reg 
    WHERE reg.game_id = ugv.game_id AND reg.member_id = get_upcoming_games_with_counts.member_id
  )
  GROUP BY 
    ugv.game_id,
    ugv.name,
    ugv.description,
    ugv.system,
    ugv.gamemaster_id,
    ugv.gm_given_name,
    ugv.gm_surname,
    ugv.status,
    ugv.first_game_date,
    ugv.last_game_date,
    ugv.member_id,
    ugv.registered_at
  ORDER BY ugv.first_game_date ASC;
END;
$$;


ALTER FUNCTION "public"."get_upcoming_games_with_counts"("member_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
BEGIN
    INSERT INTO public.member_roles (member_id, role_id)
    VALUES (NEW.id, (SELECT id FROM public.roles WHERE name = 'member'));
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."insert_into_members"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$BEGIN
    INSERT INTO public.members (id, email, provider, is_minor)
    VALUES (
        NEW.id, 
        NEW.email, 
        NEW.raw_app_meta_data->>'provider', 
        (NEW.raw_user_meta_data ->> 'is_minor')::boolean
    );
    INSERT INTO public.profiles (id, given_name, surname)
    VALUES (
        NEW.id, 
        NEW.raw_user_meta_data ->> 'given_name', 
        NEW.raw_user_meta_data ->> 'surname'
    );
    RETURN NEW;
END;$$;


ALTER FUNCTION "public"."insert_into_members"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."soft_delete_member_on_user_deletion"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Soft delete the corresponding member
    UPDATE members
    SET deleted_at = NOW()
    WHERE id = OLD.id;

    RETURN NULL; -- No direct changes to auth.users
END;
$$;


ALTER FUNCTION "public"."soft_delete_member_on_user_deletion"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."soft_delete_propagation"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
BEGIN
    -- Soft delete profiles when a member is soft-deleted
    IF TG_TABLE_NAME = 'members' THEN
        UPDATE profiles SET deleted_at = NOW() WHERE id = OLD.id;

        -- Soft delete games where the member is the gamemaster
        UPDATE games SET deleted_at = NOW() WHERE gamemaster_id = OLD.id;

    -- Soft delete game_schedule when a game is soft-deleted
    ELSIF TG_TABLE_NAME = 'games' THEN
        UPDATE game_schedule SET deleted_at = NOW() WHERE game_id = OLD.id;
    END IF;

    RETURN NULL; -- No direct change to the original table
END;
$$;


ALTER FUNCTION "public"."soft_delete_propagation"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."soft_delete_related_records"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
BEGIN
    -- Soft delete members when a user is soft-deleted
    IF TG_TABLE_NAME = 'auth.users' THEN
        UPDATE public.members
        SET deleted_at = NOW()
        WHERE id = OLD.id;

    -- Soft delete profiles when a member is soft-deleted
    ELSIF TG_TABLE_NAME = 'members' THEN
        UPDATE public.profiles
        SET deleted_at = NOW()
        WHERE member_id = OLD.id;
    END IF;

    RETURN NULL; -- No direct changes to the original table
END;
$$;


ALTER FUNCTION "public"."soft_delete_related_records"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_game_schedule_timestamp"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_game_schedule_timestamp"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_is_admin_status"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
BEGIN
    IF (SELECT COUNT(1) FROM public.member_roles mr
        JOIN public.roles r ON mr.role_id = r.id
        WHERE mr.member_id = NEW.member_id AND r.name = 'admin') > 0 THEN
        UPDATE public.members SET is_admin = TRUE WHERE id = NEW.member_id;
    ELSE
        UPDATE public.members SET is_admin = FALSE WHERE id = NEW.member_id;
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_is_admin_status"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."verify_user_password"("password" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'extensions, public, auth'
    AS $$
DECLARE
  user_id uuid;
BEGIN
  user_id := auth.uid();
  RETURN EXISTS (
    SELECT id 
    FROM auth.users 
    WHERE id = user_id AND encrypted_password = crypt(password::text, auth.users.encrypted_password)
  );
END;
$$;


ALTER FUNCTION "public"."verify_user_password"("password" "text") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."contacts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "first_name" character varying(100) NOT NULL,
    "surname" character varying(100) NOT NULL,
    "email" character varying(255) NOT NULL,
    "phone_number" character varying(15) NOT NULL,
    "is_minor" boolean NOT NULL,
    "parent_first_name" character varying(100),
    "parent_surname" character varying(100),
    "parent_phone" character varying(15),
    "parent_email" character varying(255),
    "experience_level" "public"."experience_level_enum" NOT NULL,
    "gamemaster_interest" "public"."gamemaster_interest_enum" NOT NULL,
    "preferred_system" character varying(50) NOT NULL,
    "availability" character varying(255) NOT NULL,
    "agree_to_rules" boolean NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."contacts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."game_favorites" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "game_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "member_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."game_favorites" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."game_registrations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "member_id" "uuid" NOT NULL,
    "game_id" "uuid" NOT NULL,
    "registered_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "status" "public"."registrant_status_enum" DEFAULT 'banned'::"public"."registrant_status_enum" NOT NULL,
    "status_note" "text",
    "updated_by" "uuid"
);


ALTER TABLE "public"."game_registrations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."game_schedule" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "game_id" "uuid",
    "status" "public"."game_status_enum" DEFAULT 'draft'::"public"."game_status_enum" NOT NULL,
    "interval" "public"."game_interval_enum" NOT NULL,
    "first_game_date" timestamp with time zone NOT NULL,
    "next_game_date" timestamp with time zone,
    "last_game_date" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "day_of_week" "public"."day_of_week_enum" DEFAULT 'sunday'::"public"."day_of_week_enum",
    "deleted_at" timestamp without time zone,
    "location" "text"
);


ALTER TABLE "public"."game_schedule" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."games" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" character varying(100) NOT NULL,
    "description" "text",
    "system" character varying(100),
    "max_seats" integer DEFAULT 0,
    "gamemaster_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "deleted_at" timestamp without time zone,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "image" character varying DEFAULT 'default'::character varying NOT NULL,
    "starting_seats" integer DEFAULT 0
);


ALTER TABLE "public"."games" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."members" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "email" character varying(255) NOT NULL,
    "phone" character varying(15),
    "provider" character varying(50) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "is_admin" boolean DEFAULT false NOT NULL,
    "is_minor" boolean DEFAULT false NOT NULL,
    "updated_at" timestamp with time zone,
    "deleted_at" timestamp without time zone,
    "deleted_by" "uuid"
);


ALTER TABLE "public"."members" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."is_admin" AS
 SELECT "members"."id" AS "member_id",
    "members"."is_admin"
   FROM "public"."members"
  WHERE ("members"."is_admin" = true);


ALTER TABLE "public"."is_admin" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."member_roles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "member_id" "uuid" NOT NULL,
    "role_id" "uuid" NOT NULL,
    "assigned_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "public"."member_roles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "sender_id" "uuid" NOT NULL,
    "recipient_id" "uuid" NOT NULL,
    "content" "text" NOT NULL,
    "is_read" boolean DEFAULT false NOT NULL,
    "is_archived" boolean DEFAULT false NOT NULL,
    "deleted_at" timestamp with time zone,
    "subject" character varying
);


ALTER TABLE "public"."messages" OWNER TO "postgres";


COMMENT ON TABLE "public"."messages" IS 'Inter-App messaging';



CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "given_name" character varying(100),
    "surname" character varying(100),
    "birthday" "date",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "phone" character varying(15),
    "bio" "text",
    "avatar" "text",
    "updated_at" timestamp with time zone,
    "experience_level" "public"."experience_level_enum" DEFAULT 'new'::"public"."experience_level_enum" NOT NULL
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."role_permissions" (
    "id" bigint NOT NULL,
    "role_id" "uuid" NOT NULL,
    "function" "public"."app_function" NOT NULL,
    "permission" "public"."app_permission" NOT NULL
);


ALTER TABLE "public"."role_permissions" OWNER TO "postgres";


COMMENT ON TABLE "public"."role_permissions" IS 'Application permissions for each role and function.';



ALTER TABLE "public"."role_permissions" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."role_permissions_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."roles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying(255) NOT NULL
);


ALTER TABLE "public"."roles" OWNER TO "postgres";


ALTER TABLE ONLY "public"."contacts"
    ADD CONSTRAINT "contacts_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."contacts"
    ADD CONSTRAINT "contacts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."game_favorites"
    ADD CONSTRAINT "game_favorites_pkey" PRIMARY KEY ("game_id", "member_id");



ALTER TABLE ONLY "public"."game_registrations"
    ADD CONSTRAINT "game_registrations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."game_schedule"
    ADD CONSTRAINT "game_schedule_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."games"
    ADD CONSTRAINT "games_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."member_roles"
    ADD CONSTRAINT "member_roles_member_id_role_id_key" UNIQUE ("member_id", "role_id");



ALTER TABLE ONLY "public"."member_roles"
    ADD CONSTRAINT "member_roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."members"
    ADD CONSTRAINT "members_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."members"
    ADD CONSTRAINT "members_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messgaes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."role_permissions"
    ADD CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."role_permissions"
    ADD CONSTRAINT "role_permissions_role_id_function_permission_key" UNIQUE ("role_id", "function", "permission");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_game_schedule_deleted_at" ON "public"."game_schedule" USING "btree" ("deleted_at");



CREATE INDEX "idx_games_deleted_at" ON "public"."games" USING "btree" ("deleted_at");



CREATE INDEX "idx_members_deleted_at" ON "public"."members" USING "btree" ("deleted_at");



CREATE INDEX "idx_messages_recipient_id" ON "public"."messages" USING "btree" ("recipient_id");



CREATE INDEX "idx_messages_sender_id" ON "public"."messages" USING "btree" ("sender_id");



CREATE OR REPLACE TRIGGER "on_user_created" AFTER INSERT ON "public"."members" FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_user"();



CREATE OR REPLACE TRIGGER "set_game_schedule_timestamp" BEFORE UPDATE ON "public"."game_schedule" FOR EACH ROW EXECUTE FUNCTION "public"."update_game_schedule_timestamp"();



CREATE OR REPLACE TRIGGER "set_timestamp" BEFORE UPDATE ON "public"."contacts" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "set_timestamp_contacts" BEFORE UPDATE ON "public"."contacts" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "set_timestamp_members" BEFORE UPDATE ON "public"."members" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "set_timestamp_profiles" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."game_registrations"
    ADD CONSTRAINT "fk_game_registrations_games" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."game_registrations"
    ADD CONSTRAINT "fk_game_registrations_members" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."game_schedule"
    ADD CONSTRAINT "fk_game_schedule_games" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."games"
    ADD CONSTRAINT "fk_games_members" FOREIGN KEY ("gamemaster_id") REFERENCES "public"."members"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "fk_profiles_members" FOREIGN KEY ("id") REFERENCES "public"."members"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."game_favorites"
    ADD CONSTRAINT "game_favorites_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."game_favorites"
    ADD CONSTRAINT "game_favorites_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."game_registrations"
    ADD CONSTRAINT "game_registrations_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."members"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."member_roles"
    ADD CONSTRAINT "member_roles_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."member_roles"
    ADD CONSTRAINT "member_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."members"
    ADD CONSTRAINT "members_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "public"."members"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."members"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."role_permissions"
    ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE CASCADE;



CREATE POLICY "Allow GM to edit their game schedules" ON "public"."game_schedule" TO "authenticated" USING (((EXISTS ( SELECT 1
   FROM ("public"."member_roles" "mr"
     JOIN "public"."roles" "r" ON (("mr"."role_id" = "r"."id")))
  WHERE (("mr"."member_id" = "auth"."uid"()) AND (("r"."name")::"text" = 'gamemaster'::"text")))) AND ("game_id" IN ( SELECT "games"."id"
   FROM "public"."games"
  WHERE ("games"."gamemaster_id" = "auth"."uid"())))));



CREATE POLICY "Allow auth admin to read roles" ON "public"."roles" FOR SELECT TO "supabase_auth_admin" USING (true);



CREATE POLICY "Allow auth admin to read user roles" ON "public"."member_roles" FOR SELECT TO "supabase_auth_admin" USING (true);



CREATE POLICY "Allow recipients to update messages (mark as read/archive)" ON "public"."messages" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "recipient_id"));



CREATE POLICY "Allow service role to read profiles" ON "public"."profiles" FOR SELECT TO "service_role", "postgres" USING (true);



CREATE POLICY "Enable delete for admins" ON "public"."messages" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM ("public"."member_roles" "mr"
     JOIN "public"."roles" "r" ON (("mr"."role_id" = "r"."id")))
  WHERE (("mr"."member_id" = "auth"."uid"()) AND (("r"."name")::"text" = 'admin'::"text")))));



CREATE POLICY "Enable insert for authenticated users only" ON "public"."game_favorites" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."messages" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "sender_id"));



CREATE POLICY "Enable insert for authenticated users only" ON "public"."profiles" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."role_permissions" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."game_registrations" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."game_schedule" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."games" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."member_roles" FOR SELECT TO "service_role" USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."profiles" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."roles" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable read access for service role" ON "public"."members" FOR SELECT TO "service_role", "postgres" USING (true);



CREATE POLICY "Enable users to delete their own data only" ON "public"."game_favorites" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "member_id"));



CREATE POLICY "Enable users to view their own data only" ON "public"."game_favorites" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "member_id"));



CREATE POLICY "Enable users to view their own data only" ON "public"."game_registrations" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "member_id"));



CREATE POLICY "Enable users to view their own data only" ON "public"."member_roles" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "member_id"));



CREATE POLICY "Enable users to view their own data only" ON "public"."messages" FOR SELECT TO "authenticated" USING (((( SELECT "auth"."uid"() AS "uid") = "sender_id") OR (( SELECT "auth"."uid"() AS "uid") = "recipient_id")));



CREATE POLICY "Gamemaster manages registrations to their games" ON "public"."game_registrations" TO "authenticated" USING (((EXISTS ( SELECT 1
   FROM ("public"."member_roles" "mr"
     JOIN "public"."roles" "r" ON (("mr"."role_id" = "r"."id")))
  WHERE (("mr"."member_id" = "auth"."uid"()) AND (("r"."name")::"text" = 'gamemaster'::"text")))) AND ("game_id" IN ( SELECT "games"."id"
   FROM "public"."games"
  WHERE ("games"."gamemaster_id" = "auth"."uid"()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."games"
  WHERE (("games"."id" = "game_registrations"."game_id") AND ("games"."gamemaster_id" = "auth"."uid"())))));



CREATE POLICY "access to admin" ON "public"."contacts" USING ((EXISTS ( SELECT 1
   FROM "public"."is_admin" "ia"
  WHERE ("ia"."member_id" = "auth"."uid"()))));



CREATE POLICY "admin_full_access_member_roles" ON "public"."member_roles" USING ((EXISTS ( SELECT "members"."id"
   FROM "public"."members"
  WHERE (("members"."id" = "auth"."uid"()) AND ("members"."is_admin" = true)))));



CREATE POLICY "admin_full_access_roles" ON "public"."roles" USING ((EXISTS ( SELECT "members"."id"
   FROM "public"."members"
  WHERE (("members"."id" = "auth"."uid"()) AND ("members"."is_admin" = true)))));



CREATE POLICY "allow_all_read" ON "public"."members" FOR SELECT USING (true);



CREATE POLICY "allow_gamemaster_manage_own_games" ON "public"."games" TO "authenticated" USING (("auth"."uid"() = "gamemaster_id"));



CREATE POLICY "allow_member_update_own_profile" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "allow_member_view_own_profile" ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "id"));



CREATE POLICY "allow_user_select_self" ON "public"."members" FOR SELECT USING (("auth"."uid"() = "id"));



CREATE POLICY "allow_user_update_self" ON "public"."members" FOR UPDATE USING (("auth"."uid"() = "id"));



ALTER TABLE "public"."contacts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."game_favorites" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."game_registrations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."game_schedule" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."games" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."member_roles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."members" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."messages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."role_permissions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."roles" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."messages";









GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";
GRANT USAGE ON SCHEMA "public" TO "supabase_auth_admin";















































































































































































































REVOKE ALL ON FUNCTION "public"."custom_access_token_hook"("event" "jsonb") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."custom_access_token_hook"("event" "jsonb") TO "service_role";
GRANT ALL ON FUNCTION "public"."custom_access_token_hook"("event" "jsonb") TO "supabase_auth_admin";



GRANT ALL ON FUNCTION "public"."get_scheduled_games_with_counts"("member_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_scheduled_games_with_counts"("member_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_scheduled_games_with_counts"("member_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_upcoming_games_with_counts"("member_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_upcoming_games_with_counts"("member_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_upcoming_games_with_counts"("member_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."insert_into_members"() TO "anon";
GRANT ALL ON FUNCTION "public"."insert_into_members"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."insert_into_members"() TO "service_role";



GRANT ALL ON FUNCTION "public"."soft_delete_member_on_user_deletion"() TO "anon";
GRANT ALL ON FUNCTION "public"."soft_delete_member_on_user_deletion"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."soft_delete_member_on_user_deletion"() TO "service_role";



GRANT ALL ON FUNCTION "public"."soft_delete_propagation"() TO "anon";
GRANT ALL ON FUNCTION "public"."soft_delete_propagation"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."soft_delete_propagation"() TO "service_role";



GRANT ALL ON FUNCTION "public"."soft_delete_related_records"() TO "anon";
GRANT ALL ON FUNCTION "public"."soft_delete_related_records"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."soft_delete_related_records"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_game_schedule_timestamp"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_game_schedule_timestamp"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_game_schedule_timestamp"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_is_admin_status"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_is_admin_status"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_is_admin_status"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."verify_user_password"("password" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."verify_user_password"("password" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."verify_user_password"("password" "text") TO "service_role";
























GRANT ALL ON TABLE "public"."contacts" TO "anon";
GRANT ALL ON TABLE "public"."contacts" TO "authenticated";
GRANT ALL ON TABLE "public"."contacts" TO "service_role";



GRANT ALL ON TABLE "public"."game_favorites" TO "anon";
GRANT ALL ON TABLE "public"."game_favorites" TO "authenticated";
GRANT ALL ON TABLE "public"."game_favorites" TO "service_role";



GRANT ALL ON TABLE "public"."game_registrations" TO "anon";
GRANT ALL ON TABLE "public"."game_registrations" TO "authenticated";
GRANT ALL ON TABLE "public"."game_registrations" TO "service_role";



GRANT ALL ON TABLE "public"."game_schedule" TO "anon";
GRANT ALL ON TABLE "public"."game_schedule" TO "authenticated";
GRANT ALL ON TABLE "public"."game_schedule" TO "service_role";



GRANT ALL ON TABLE "public"."games" TO "anon";
GRANT ALL ON TABLE "public"."games" TO "authenticated";
GRANT ALL ON TABLE "public"."games" TO "service_role";



GRANT ALL ON TABLE "public"."members" TO "anon";
GRANT ALL ON TABLE "public"."members" TO "authenticated";
GRANT ALL ON TABLE "public"."members" TO "service_role";



GRANT ALL ON TABLE "public"."is_admin" TO "anon";
GRANT ALL ON TABLE "public"."is_admin" TO "authenticated";
GRANT ALL ON TABLE "public"."is_admin" TO "service_role";



GRANT ALL ON TABLE "public"."member_roles" TO "service_role";
GRANT ALL ON TABLE "public"."member_roles" TO "supabase_auth_admin";
GRANT ALL ON TABLE "public"."member_roles" TO "authenticated";
GRANT ALL ON TABLE "public"."member_roles" TO "anon";
GRANT ALL ON TABLE "public"."member_roles" TO PUBLIC;



GRANT ALL ON TABLE "public"."messages" TO "anon";
GRANT ALL ON TABLE "public"."messages" TO "authenticated";
GRANT ALL ON TABLE "public"."messages" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."role_permissions" TO "anon";
GRANT ALL ON TABLE "public"."role_permissions" TO "authenticated";
GRANT ALL ON TABLE "public"."role_permissions" TO "service_role";



GRANT ALL ON SEQUENCE "public"."role_permissions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."role_permissions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."role_permissions_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."roles" TO "service_role";
GRANT ALL ON TABLE "public"."roles" TO "supabase_auth_admin";
GRANT ALL ON TABLE "public"."roles" TO "authenticated";
GRANT ALL ON TABLE "public"."roles" TO "anon";
GRANT ALL ON TABLE "public"."roles" TO PUBLIC;



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
