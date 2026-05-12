-- Trigger : crée automatiquement un profil à chaque nouvel inscrit
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', new.email),
    new.raw_user_meta_data->>'phone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Backfill : profils pour les utilisateurs déjà existants
insert into public.profiles (id, name, phone)
select
  id,
  coalesce(raw_user_meta_data->>'name', email),
  raw_user_meta_data->>'phone'
from auth.users
on conflict (id) do nothing;
