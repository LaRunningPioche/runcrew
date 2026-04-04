create table "public"."run_participations" (
  "id" uuid not null default gen_random_uuid(),
  "run_id" uuid not null references runs(id) on delete cascade,
  "user_id" uuid not null references auth.users(id) on delete cascade,
  "user_name" text not null,
  "created_at" timestamp without time zone default now(),
  primary key ("id"),
  unique ("run_id", "user_id")
);

alter table "public"."run_participations" enable row level security;

create policy "Visible par tous les membres" on "public"."run_participations"
  for select using (true);

create policy "Gérer sa propre participation" on "public"."run_participations"
  for all using (auth.uid() = user_id);
