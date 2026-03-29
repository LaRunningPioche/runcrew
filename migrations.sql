-- RunCrew — Database Migrations
-- Run this in Supabase Dashboard → SQL Editor

-- 1. Profiles (linked to Supabase auth.users)
create table profiles (
  id uuid references auth.users primary key,
  name text not null,
  phone text,
  updated_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "Auth users can read all profiles" on profiles
  for select using (auth.role() = 'authenticated');
create policy "Users manage own profile" on profiles
  for all using (auth.uid() = id);

-- 2. Groups (columns match runcrew/js: code, creator_name, name, id, created_at)
create table groups (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  code text unique not null,
  creator_name text not null,
  created_at timestamptz
);
alter table groups enable row level security;
-- Allow all authenticated users to view groups (needed for invite link join flow)
create policy "Authenticated users can view groups" on groups
  for select using (auth.role() = 'authenticated');
-- Creator name must match the signed-in user's profile (replaces owner_id check)
create policy "Authenticated users can create groups" on groups
  for insert with check (
    auth.role() = 'authenticated'
    and creator_name = (select p.name from profiles p where p.id = auth.uid())
  );

-- 3. Memberships (columns match runcrew/js: id, group_id, member_name, member_phone, status, created_at)
create table memberships (
  id uuid default gen_random_uuid() primary key,
  group_id uuid references groups(id) on delete cascade,
  member_name text not null,
  member_phone text,
  status text,
  created_at timestamptz
);
alter table memberships enable row level security;
create policy "Users read own membership rows" on memberships
  for select using (
    member_name = (select p.name from profiles p where p.id = auth.uid())
  );
create policy "Creators read group memberships" on memberships
  for select using (
    exists (
      select 1 from groups g
      where g.id = memberships.group_id
        and g.creator_name = (select p.name from profiles p where p.id = auth.uid())
    )
  );
create policy "Users insert own join requests" on memberships
  for insert with check (
    member_name = (select p.name from profiles p where p.id = auth.uid())
    and group_id is not null
  );
create policy "Creators update memberships" on memberships
  for update using (
    exists (
      select 1 from groups g
      where g.id = memberships.group_id
        and g.creator_name = (select p.name from profiles p where p.id = auth.uid())
    )
  );
create policy "Creators delete memberships" on memberships
  for delete using (
    exists (
      select 1 from groups g
      where g.id = memberships.group_id
        and g.creator_name = (select p.name from profiles p where p.id = auth.uid())
    )
  );

-- 4. Runs (columns match runcrew/js: group_id, creator_name, creator_phone, date, time, location, description)
create table runs (
  id uuid default gen_random_uuid() primary key,
  group_id uuid references groups(id) on delete cascade,
  creator_name text not null,
  creator_phone text,
  date date not null,
  time text not null,
  location text,
  description text not null,
  created_at timestamptz
);
alter table runs enable row level security;
create policy "Group members can view runs" on runs
  for select using (
    exists (
      select 1 from groups g
      where g.id = runs.group_id
        and g.creator_name = (select p.name from profiles p where p.id = auth.uid())
    )
    or exists (
      select 1 from memberships m
      where m.group_id = runs.group_id
        and m.status = 'approved'
        and m.member_name = (select p.name from profiles p where p.id = auth.uid())
    )
  );
create policy "Members can create runs in their group" on runs
  for insert with check (
    creator_name = (select p.name from profiles p where p.id = auth.uid())
    and (
      exists (
        select 1 from groups g
        where g.id = runs.group_id
          and g.creator_name = creator_name
      )
      or exists (
        select 1 from memberships m
        where m.group_id = runs.group_id
          and m.status = 'approved'
          and m.member_name = creator_name
      )
    )
  );
create policy "Creators can delete own runs" on runs
  for delete using (
    creator_name = (select p.name from profiles p where p.id = auth.uid())
  );

-- --- Optional: upgrade an existing DB that still has owner_id + invite_code ---
-- drop policy if exists "Authenticated users can create groups" on groups;
-- alter table groups rename column invite_code to code;
-- alter table groups add column if not exists creator_name text;
-- update groups g set creator_name = coalesce(g.creator_name, (select p.name from profiles p where p.id = g.owner_id))
--   where g.creator_name is null;
-- alter table groups alter column creator_name set not null;
-- alter table groups drop column if exists owner_id;
-- create policy "Authenticated users can create groups" on groups
--   for insert with check (
--     auth.role() = 'authenticated'
--     and creator_name = (select p.name from profiles p where p.id = auth.uid())
--   );

-- --- Optional: replace legacy group_members with memberships (customize data migration as needed) ---
-- drop policy if exists "Users can see own memberships" on group_members;
-- drop policy if exists "Members can see co-members" on group_members;
-- drop policy if exists "Authenticated users can join groups" on group_members;
-- drop table if exists group_members;
-- (then run section 3 memberships + section 4 runs policies from this file)

-- --- Optional: legacy runs.user_id only (not used by JS); add if an old project still has it ---
-- alter table runs add column if not exists user_id uuid references profiles(id);
