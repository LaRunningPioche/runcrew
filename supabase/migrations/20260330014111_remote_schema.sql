drop extension if exists "pg_net";


  create table "public"."groups" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "code" text not null,
    "creator_name" text not null,
    "created_at" timestamp without time zone default now()
      );


alter table "public"."groups" enable row level security;


  create table "public"."memberships" (
    "id" uuid not null default gen_random_uuid(),
    "group_id" uuid,
    "member_name" text not null,
    "member_phone" text,
    "status" text default 'pending'::text,
    "created_at" timestamp without time zone default now()
      );


alter table "public"."memberships" enable row level security;


  create table "public"."runs" (
    "id" uuid not null default gen_random_uuid(),
    "group_id" uuid,
    "creator_name" text not null,
    "creator_phone" text,
    "date" date not null,
    "time" text not null,
    "location" text,
    "description" text not null,
    "created_at" timestamp without time zone default now()
      );


alter table "public"."runs" enable row level security;

CREATE UNIQUE INDEX groups_code_key ON public.groups USING btree (code);

CREATE UNIQUE INDEX groups_pkey ON public.groups USING btree (id);

CREATE UNIQUE INDEX memberships_pkey ON public.memberships USING btree (id);

CREATE UNIQUE INDEX runs_pkey ON public.runs USING btree (id);

alter table "public"."groups" add constraint "groups_pkey" PRIMARY KEY using index "groups_pkey";

alter table "public"."memberships" add constraint "memberships_pkey" PRIMARY KEY using index "memberships_pkey";

alter table "public"."runs" add constraint "runs_pkey" PRIMARY KEY using index "runs_pkey";

alter table "public"."groups" add constraint "groups_code_key" UNIQUE using index "groups_code_key";

alter table "public"."memberships" add constraint "memberships_group_id_fkey" FOREIGN KEY (group_id) REFERENCES public.groups(id) ON DELETE CASCADE not valid;

alter table "public"."memberships" validate constraint "memberships_group_id_fkey";

alter table "public"."runs" add constraint "runs_group_id_fkey" FOREIGN KEY (group_id) REFERENCES public.groups(id) ON DELETE CASCADE not valid;

alter table "public"."runs" validate constraint "runs_group_id_fkey";

grant delete on table "public"."groups" to "anon";

grant insert on table "public"."groups" to "anon";

grant references on table "public"."groups" to "anon";

grant select on table "public"."groups" to "anon";

grant trigger on table "public"."groups" to "anon";

grant truncate on table "public"."groups" to "anon";

grant update on table "public"."groups" to "anon";

grant delete on table "public"."groups" to "authenticated";

grant insert on table "public"."groups" to "authenticated";

grant references on table "public"."groups" to "authenticated";

grant select on table "public"."groups" to "authenticated";

grant trigger on table "public"."groups" to "authenticated";

grant truncate on table "public"."groups" to "authenticated";

grant update on table "public"."groups" to "authenticated";

grant delete on table "public"."groups" to "service_role";

grant insert on table "public"."groups" to "service_role";

grant references on table "public"."groups" to "service_role";

grant select on table "public"."groups" to "service_role";

grant trigger on table "public"."groups" to "service_role";

grant truncate on table "public"."groups" to "service_role";

grant update on table "public"."groups" to "service_role";

grant delete on table "public"."memberships" to "anon";

grant insert on table "public"."memberships" to "anon";

grant references on table "public"."memberships" to "anon";

grant select on table "public"."memberships" to "anon";

grant trigger on table "public"."memberships" to "anon";

grant truncate on table "public"."memberships" to "anon";

grant update on table "public"."memberships" to "anon";

grant delete on table "public"."memberships" to "authenticated";

grant insert on table "public"."memberships" to "authenticated";

grant references on table "public"."memberships" to "authenticated";

grant select on table "public"."memberships" to "authenticated";

grant trigger on table "public"."memberships" to "authenticated";

grant truncate on table "public"."memberships" to "authenticated";

grant update on table "public"."memberships" to "authenticated";

grant delete on table "public"."memberships" to "service_role";

grant insert on table "public"."memberships" to "service_role";

grant references on table "public"."memberships" to "service_role";

grant select on table "public"."memberships" to "service_role";

grant trigger on table "public"."memberships" to "service_role";

grant truncate on table "public"."memberships" to "service_role";

grant update on table "public"."memberships" to "service_role";

grant delete on table "public"."runs" to "anon";

grant insert on table "public"."runs" to "anon";

grant references on table "public"."runs" to "anon";

grant select on table "public"."runs" to "anon";

grant trigger on table "public"."runs" to "anon";

grant truncate on table "public"."runs" to "anon";

grant update on table "public"."runs" to "anon";

grant delete on table "public"."runs" to "authenticated";

grant insert on table "public"."runs" to "authenticated";

grant references on table "public"."runs" to "authenticated";

grant select on table "public"."runs" to "authenticated";

grant trigger on table "public"."runs" to "authenticated";

grant truncate on table "public"."runs" to "authenticated";

grant update on table "public"."runs" to "authenticated";

grant delete on table "public"."runs" to "service_role";

grant insert on table "public"."runs" to "service_role";

grant references on table "public"."runs" to "service_role";

grant select on table "public"."runs" to "service_role";

grant trigger on table "public"."runs" to "service_role";

grant truncate on table "public"."runs" to "service_role";

grant update on table "public"."runs" to "service_role";


  create policy "insert groups"
  on "public"."groups"
  as permissive
  for insert
  to public
with check (true);



  create policy "read groups"
  on "public"."groups"
  as permissive
  for select
  to public
using (true);



  create policy "delete memberships"
  on "public"."memberships"
  as permissive
  for delete
  to public
using (true);



  create policy "insert memberships"
  on "public"."memberships"
  as permissive
  for insert
  to public
with check (true);



  create policy "read memberships"
  on "public"."memberships"
  as permissive
  for select
  to public
using (true);



  create policy "update memberships"
  on "public"."memberships"
  as permissive
  for update
  to public
using (true);



  create policy "delete runs"
  on "public"."runs"
  as permissive
  for delete
  to public
using (true);



  create policy "insert runs"
  on "public"."runs"
  as permissive
  for insert
  to public
with check (true);



  create policy "read runs"
  on "public"."runs"
  as permissive
  for select
  to public
using (true);



