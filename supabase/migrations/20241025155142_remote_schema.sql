create sequence "public"."roles_id_seq";

create table "public"."game_registrations" (
    "id" uuid not null default gen_random_uuid(),
    "game_id" uuid,
    "member_id" uuid
);


alter table "public"."game_registrations" enable row level security;

create table "public"."games" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "description" text,
    "gm_member_id" uuid,
    "created_at" timestamp with time zone default now()
);


alter table "public"."games" enable row level security;

create table "public"."member_roles" (
    "id" uuid not null default gen_random_uuid(),
    "member_id" uuid,
    "role_id" integer
);


alter table "public"."member_roles" enable row level security;

create table "public"."members" (
    "id" uuid not null default gen_random_uuid(),
    "email" text not null,
    "created_at" timestamp with time zone default now()
);


alter table "public"."members" enable row level security;

create table "public"."profiles" (
    "id" uuid not null,
    "firstname" text,
    "surname" text,
    "phone" text,
    "birthday" date,
    "bio" text,
    "avatar_url" text,
    "member_id" uuid
);


alter table "public"."profiles" enable row level security;

create table "public"."roles" (
    "id" integer not null default nextval('roles_id_seq'::regclass),
    "name" text not null
);


alter table "public"."roles" enable row level security;

alter sequence "public"."roles_id_seq" owned by "public"."roles"."id";

CREATE UNIQUE INDEX game_registrations_game_id_member_id_key ON public.game_registrations USING btree (game_id, member_id);

CREATE UNIQUE INDEX game_registrations_pkey ON public.game_registrations USING btree (id);

CREATE UNIQUE INDEX games_pkey ON public.games USING btree (id);

CREATE UNIQUE INDEX member_roles_member_id_role_id_key ON public.member_roles USING btree (member_id, role_id);

CREATE UNIQUE INDEX member_roles_pkey ON public.member_roles USING btree (id);

CREATE UNIQUE INDEX members_email_key ON public.members USING btree (email);

CREATE UNIQUE INDEX members_pkey ON public.members USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX roles_name_key ON public.roles USING btree (name);

CREATE UNIQUE INDEX roles_pkey ON public.roles USING btree (id);

alter table "public"."game_registrations" add constraint "game_registrations_pkey" PRIMARY KEY using index "game_registrations_pkey";

alter table "public"."games" add constraint "games_pkey" PRIMARY KEY using index "games_pkey";

alter table "public"."member_roles" add constraint "member_roles_pkey" PRIMARY KEY using index "member_roles_pkey";

alter table "public"."members" add constraint "members_pkey" PRIMARY KEY using index "members_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."roles" add constraint "roles_pkey" PRIMARY KEY using index "roles_pkey";

alter table "public"."game_registrations" add constraint "game_registrations_game_id_fkey" FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE not valid;

alter table "public"."game_registrations" validate constraint "game_registrations_game_id_fkey";

alter table "public"."game_registrations" add constraint "game_registrations_game_id_member_id_key" UNIQUE using index "game_registrations_game_id_member_id_key";

alter table "public"."game_registrations" add constraint "game_registrations_member_id_fkey" FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE not valid;

alter table "public"."game_registrations" validate constraint "game_registrations_member_id_fkey";

alter table "public"."games" add constraint "games_gm_member_id_fkey" FOREIGN KEY (gm_member_id) REFERENCES members(id) not valid;

alter table "public"."games" validate constraint "games_gm_member_id_fkey";

alter table "public"."member_roles" add constraint "member_roles_member_id_fkey" FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE not valid;

alter table "public"."member_roles" validate constraint "member_roles_member_id_fkey";

alter table "public"."member_roles" add constraint "member_roles_member_id_role_id_key" UNIQUE using index "member_roles_member_id_role_id_key";

alter table "public"."member_roles" add constraint "member_roles_role_id_fkey" FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE not valid;

alter table "public"."member_roles" validate constraint "member_roles_role_id_fkey";

alter table "public"."members" add constraint "members_email_key" UNIQUE using index "members_email_key";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES members(id) not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."profiles" add constraint "profiles_member_id_fkey" FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_member_id_fkey";

alter table "public"."roles" add constraint "roles_name_key" UNIQUE using index "roles_name_key";

grant delete on table "public"."game_registrations" to "anon";

grant insert on table "public"."game_registrations" to "anon";

grant references on table "public"."game_registrations" to "anon";

grant select on table "public"."game_registrations" to "anon";

grant trigger on table "public"."game_registrations" to "anon";

grant truncate on table "public"."game_registrations" to "anon";

grant update on table "public"."game_registrations" to "anon";

grant delete on table "public"."game_registrations" to "authenticated";

grant insert on table "public"."game_registrations" to "authenticated";

grant references on table "public"."game_registrations" to "authenticated";

grant select on table "public"."game_registrations" to "authenticated";

grant trigger on table "public"."game_registrations" to "authenticated";

grant truncate on table "public"."game_registrations" to "authenticated";

grant update on table "public"."game_registrations" to "authenticated";

grant delete on table "public"."game_registrations" to "service_role";

grant insert on table "public"."game_registrations" to "service_role";

grant references on table "public"."game_registrations" to "service_role";

grant select on table "public"."game_registrations" to "service_role";

grant trigger on table "public"."game_registrations" to "service_role";

grant truncate on table "public"."game_registrations" to "service_role";

grant update on table "public"."game_registrations" to "service_role";

grant delete on table "public"."games" to "anon";

grant insert on table "public"."games" to "anon";

grant references on table "public"."games" to "anon";

grant select on table "public"."games" to "anon";

grant trigger on table "public"."games" to "anon";

grant truncate on table "public"."games" to "anon";

grant update on table "public"."games" to "anon";

grant delete on table "public"."games" to "authenticated";

grant insert on table "public"."games" to "authenticated";

grant references on table "public"."games" to "authenticated";

grant select on table "public"."games" to "authenticated";

grant trigger on table "public"."games" to "authenticated";

grant truncate on table "public"."games" to "authenticated";

grant update on table "public"."games" to "authenticated";

grant delete on table "public"."games" to "service_role";

grant insert on table "public"."games" to "service_role";

grant references on table "public"."games" to "service_role";

grant select on table "public"."games" to "service_role";

grant trigger on table "public"."games" to "service_role";

grant truncate on table "public"."games" to "service_role";

grant update on table "public"."games" to "service_role";

grant delete on table "public"."member_roles" to "anon";

grant insert on table "public"."member_roles" to "anon";

grant references on table "public"."member_roles" to "anon";

grant select on table "public"."member_roles" to "anon";

grant trigger on table "public"."member_roles" to "anon";

grant truncate on table "public"."member_roles" to "anon";

grant update on table "public"."member_roles" to "anon";

grant delete on table "public"."member_roles" to "authenticated";

grant insert on table "public"."member_roles" to "authenticated";

grant references on table "public"."member_roles" to "authenticated";

grant select on table "public"."member_roles" to "authenticated";

grant trigger on table "public"."member_roles" to "authenticated";

grant truncate on table "public"."member_roles" to "authenticated";

grant update on table "public"."member_roles" to "authenticated";

grant delete on table "public"."member_roles" to "service_role";

grant insert on table "public"."member_roles" to "service_role";

grant references on table "public"."member_roles" to "service_role";

grant select on table "public"."member_roles" to "service_role";

grant trigger on table "public"."member_roles" to "service_role";

grant truncate on table "public"."member_roles" to "service_role";

grant update on table "public"."member_roles" to "service_role";

grant delete on table "public"."members" to "anon";

grant insert on table "public"."members" to "anon";

grant references on table "public"."members" to "anon";

grant select on table "public"."members" to "anon";

grant trigger on table "public"."members" to "anon";

grant truncate on table "public"."members" to "anon";

grant update on table "public"."members" to "anon";

grant delete on table "public"."members" to "authenticated";

grant insert on table "public"."members" to "authenticated";

grant references on table "public"."members" to "authenticated";

grant select on table "public"."members" to "authenticated";

grant trigger on table "public"."members" to "authenticated";

grant truncate on table "public"."members" to "authenticated";

grant update on table "public"."members" to "authenticated";

grant delete on table "public"."members" to "service_role";

grant insert on table "public"."members" to "service_role";

grant references on table "public"."members" to "service_role";

grant select on table "public"."members" to "service_role";

grant trigger on table "public"."members" to "service_role";

grant truncate on table "public"."members" to "service_role";

grant update on table "public"."members" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."roles" to "anon";

grant insert on table "public"."roles" to "anon";

grant references on table "public"."roles" to "anon";

grant select on table "public"."roles" to "anon";

grant trigger on table "public"."roles" to "anon";

grant truncate on table "public"."roles" to "anon";

grant update on table "public"."roles" to "anon";

grant delete on table "public"."roles" to "authenticated";

grant insert on table "public"."roles" to "authenticated";

grant references on table "public"."roles" to "authenticated";

grant select on table "public"."roles" to "authenticated";

grant trigger on table "public"."roles" to "authenticated";

grant truncate on table "public"."roles" to "authenticated";

grant update on table "public"."roles" to "authenticated";

grant delete on table "public"."roles" to "service_role";

grant insert on table "public"."roles" to "service_role";

grant references on table "public"."roles" to "service_role";

grant select on table "public"."roles" to "service_role";

grant trigger on table "public"."roles" to "service_role";

grant truncate on table "public"."roles" to "service_role";

grant update on table "public"."roles" to "service_role";

create policy "Register for games - insert"
on "public"."game_registrations"
as permissive
for insert
to public
with check ((auth.uid() IS NOT NULL));


create policy "Register for games - select"
on "public"."game_registrations"
as permissive
for select
to public
using ((auth.uid() IS NOT NULL));


create policy "Gamemaster game management - delete"
on "public"."games"
as permissive
for delete
to public
using ((auth.uid() = gm_member_id));


create policy "Gamemaster game management - insert"
on "public"."games"
as permissive
for insert
to public
with check ((EXISTS ( SELECT 1
   FROM (member_roles mr
     JOIN roles r ON ((mr.role_id = r.id)))
  WHERE ((mr.member_id = auth.uid()) AND (r.name = 'gamemaster'::text)))));


create policy "Gamemaster game management - select"
on "public"."games"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM (member_roles mr
     JOIN roles r ON ((mr.role_id = r.id)))
  WHERE ((mr.member_id = auth.uid()) AND (r.name = 'gamemaster'::text)))));


create policy "Gamemaster game management - update"
on "public"."games"
as permissive
for update
to public
using ((auth.uid() = gm_member_id))
with check ((auth.uid() = gm_member_id));


create policy "Admin Role Assignment (delete)"
on "public"."member_roles"
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM (member_roles mr
     JOIN roles r ON ((mr.role_id = r.id)))
  WHERE ((mr.member_id = auth.uid()) AND (r.name = 'admin'::text)))));


create policy "Admin Role Assignment"
on "public"."member_roles"
as permissive
for insert
to public
with check ((EXISTS ( SELECT 1
   FROM (member_roles mr
     JOIN roles r ON ((mr.role_id = r.id)))
  WHERE ((mr.member_id = auth.uid()) AND (r.name = 'admin'::text)))));


create policy "Admin manage members - delete"
on "public"."members"
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM (member_roles mr
     JOIN roles r ON ((mr.role_id = r.id)))
  WHERE ((mr.member_id = auth.uid()) AND (r.name = 'admin'::text)))));


create policy "Admin manage members - select"
on "public"."members"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM (member_roles mr
     JOIN roles r ON ((mr.role_id = r.id)))
  WHERE ((mr.member_id = auth.uid()) AND (r.name = 'admin'::text)))));


create policy "Admin manage members - update"
on "public"."members"
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM (member_roles mr
     JOIN roles r ON ((mr.role_id = r.id)))
  WHERE ((mr.member_id = auth.uid()) AND (r.name = 'admin'::text)))))
with check ((EXISTS ( SELECT 1
   FROM (member_roles mr
     JOIN roles r ON ((mr.role_id = r.id)))
  WHERE ((mr.member_id = auth.uid()) AND (r.name = 'admin'::text)))));


create policy "Allow signup for members"
on "public"."members"
as permissive
for insert
to public
with check ((auth.uid() = id));


create policy "Member delete own account"
on "public"."members"
as permissive
for delete
to public
using ((auth.uid() = id));


create policy "Member manage own account - select"
on "public"."members"
as permissive
for select
to public
using ((auth.uid() = id));


create policy "Member manage own account - update"
on "public"."members"
as permissive
for update
to public
using ((auth.uid() = id))
with check ((auth.uid() = id));


create policy "Manage own profile (update)"
on "public"."profiles"
as permissive
for update
to public
using ((auth.uid() = member_id));


create policy "Manage own profile"
on "public"."profiles"
as permissive
for select
to public
using ((auth.uid() = member_id));


create policy "Admin can delete roles"
on "public"."roles"
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM (member_roles mr
     JOIN roles r ON ((mr.role_id = r.id)))
  WHERE ((mr.member_id = auth.uid()) AND (r.name = 'admin'::text)))));


create policy "Admin can insert roles"
on "public"."roles"
as permissive
for insert
to public
with check ((EXISTS ( SELECT 1
   FROM (member_roles mr
     JOIN roles r ON ((mr.role_id = r.id)))
  WHERE ((mr.member_id = auth.uid()) AND (r.name = 'admin'::text)))));


create policy "Admin can update roles"
on "public"."roles"
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM (member_roles mr
     JOIN roles r ON ((mr.role_id = r.id)))
  WHERE ((mr.member_id = auth.uid()) AND (r.name = 'admin'::text)))))
with check ((EXISTS ( SELECT 1
   FROM (member_roles mr
     JOIN roles r ON ((mr.role_id = r.id)))
  WHERE ((mr.member_id = auth.uid()) AND (r.name = 'admin'::text)))));



