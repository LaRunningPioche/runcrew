alter table "public"."runs" add column "duration" text;
alter table "public"."runs" add column "elevation_gain" integer;
alter table "public"."runs" add column "run_type" text;
alter table "public"."runs" add column "terrain" text;
alter table "public"."runs" add column "schedule_flexible" boolean default false;
