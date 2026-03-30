-- Create profiles table linked to auth.users
create table if not exists public.profiles (
  id uuid references auth.users primary key,
  name text not null,
  phone text,
  updated_at timestamptz default now()
);
alter table public.profiles enable row level security;

drop policy if exists "Auth users can read all profiles" on public.profiles;
create policy "Auth users can read all profiles" on public.profiles
  for select using (auth.role() = 'authenticated');

drop policy if exists "Users manage own profile" on public.profiles;
create policy "Users manage own profile" on public.profiles
  for all using (auth.uid() = id);

-- Add creator_id to groups, backfill from profiles
alter table public.groups add column if not exists creator_id uuid references auth.users;
update public.groups g
  set creator_id = p.id
  from public.profiles p
  where p.name = g.creator_name and g.creator_id is null;
alter table public.groups alter column creator_id set not null;

-- Add member_id to memberships, backfill from profiles
alter table public.memberships add column if not exists member_id uuid references auth.users;
update public.memberships m
  set member_id = p.id
  from public.profiles p
  where p.name = m.member_name and m.member_id is null;
alter table public.memberships alter column member_id set not null;

-- Add creator_id to runs, backfill from profiles
alter table public.runs add column if not exists creator_id uuid references auth.users;
update public.runs r
  set creator_id = p.id
  from public.profiles p
  where p.name = r.creator_name and r.creator_id is null;
alter table public.runs alter column creator_id set not null;

-- Replace permissive policies on groups with proper RLS
drop policy if exists "insert groups" on public.groups;
drop policy if exists "read groups" on public.groups;
drop policy if exists "Authenticated users can view groups" on public.groups;
drop policy if exists "Authenticated users can create groups" on public.groups;

create policy "Authenticated users can view groups" on public.groups
  for select using (auth.role() = 'authenticated');
create policy "Authenticated users can create groups" on public.groups
  for insert with check (auth.uid() = creator_id);

-- Replace permissive policies on memberships
drop policy if exists "read memberships" on public.memberships;
drop policy if exists "insert memberships" on public.memberships;
drop policy if exists "update memberships" on public.memberships;
drop policy if exists "delete memberships" on public.memberships;
drop policy if exists "Users read own membership rows" on public.memberships;
drop policy if exists "Creators read group memberships" on public.memberships;
drop policy if exists "Users insert own join requests" on public.memberships;
drop policy if exists "Creators update memberships" on public.memberships;
drop policy if exists "Creators delete memberships" on public.memberships;

create policy "Users read own membership rows" on public.memberships
  for select using (member_id = auth.uid());
create policy "Creators read group memberships" on public.memberships
  for select using (
    exists (
      select 1 from public.groups g
      where g.id = memberships.group_id and g.creator_id = auth.uid()
    )
  );
create policy "Users insert own join requests" on public.memberships
  for insert with check (member_id = auth.uid() and group_id is not null);
create policy "Creators update memberships" on public.memberships
  for update using (
    exists (
      select 1 from public.groups g
      where g.id = memberships.group_id and g.creator_id = auth.uid()
    )
  );
create policy "Creators delete memberships" on public.memberships
  for delete using (
    exists (
      select 1 from public.groups g
      where g.id = memberships.group_id and g.creator_id = auth.uid()
    )
  );

-- Replace permissive policies on runs
drop policy if exists "read runs" on public.runs;
drop policy if exists "insert runs" on public.runs;
drop policy if exists "delete runs" on public.runs;
drop policy if exists "Group members can view runs" on public.runs;
drop policy if exists "Members can create runs in their group" on public.runs;
drop policy if exists "Creators can delete own runs" on public.runs;

create policy "Group members can view runs" on public.runs
  for select using (
    exists (
      select 1 from public.groups g
      where g.id = runs.group_id and g.creator_id = auth.uid()
    )
    or exists (
      select 1 from public.memberships m
      where m.group_id = runs.group_id
        and m.status = 'approved'
        and m.member_id = auth.uid()
    )
  );
create policy "Members can create runs in their group" on public.runs
  for insert with check (
    creator_id = auth.uid()
    and (
      exists (
        select 1 from public.groups g
        where g.id = runs.group_id and g.creator_id = auth.uid()
      )
      or exists (
        select 1 from public.memberships m
        where m.group_id = runs.group_id
          and m.status = 'approved'
          and m.member_id = auth.uid()
      )
    )
  );
create policy "Creators can delete own runs" on public.runs
  for delete using (creator_id = auth.uid());
