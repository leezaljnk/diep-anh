-- Public-write mini-game: do not use this policy model for private data.
create or replace function public.valid_game_asset_id(asset_id text)
returns boolean language sql immutable set search_path = '' as $$
  select asset_id in (
    'images/mascot/main', 'images/bins/organic', 'images/bins/recyclable',
    'voice/correct', 'voice/incorrect', 'voice/victory'
  ) or asset_id ~ '^voice/(welcome|continue_sorting|batch_complete|approach_bin|approach_trash|select_trash|bin_unavailable|mode_drag|mode_command|mascot_updated)$'
    or asset_id ~ '^voice/(selected|picked)_(vo_hop_sua|vo_hop_giay|giay_cu|vo_chai|ong_nhua|vo_keo|vo_lon|vo_chai_nhua|xuong_ca|dui_ga|vo_dua_hau|banh_mi|la_cay|vo_chuoi|vo_tao|unknown|yard_flower_petals|yard_twig|yard_grass|yard_pine_cone|yard_acorn|yard_plastic_cup|yard_plastic_lid|yard_plastic_spoon|yard_broken_ruler|yard_food_container)$'
    or asset_id ~ '^voice/(correct_great|correct_thanks|yard_welcome|yard_victory|scene_busy|play_area_small)$'
    or asset_id ~ '^voice/garden_(intro|free|challenge|hazard|game_over|victory)$'
    or asset_id ~ '^voice/sorting_(intro|start|removed|connected|select|retry|round_complete|more|continue|safety|victory)$'
    or asset_id ~ '^voice/sorting_selected_(cd|chai_nhua|cuon_giay|giay_vun|hop_giay|tat_cu|vo_chai|vo_hop|vo_lon|vo_lop)$'
    or asset_id ~ '^images/costumes/tim_rac_(0[1-9]|1[0-5])$'
    or asset_id ~ '^images/costumes/(vui|buon)_0[1-4]$'
    or asset_id ~ '^images/costumes/cam_(gio|hopsua|hopgiay|giaycu|vochai|ongnhua|vokeo|volon|vochainhua|xuongca|duiga|voduahau|banh_mi|lacay|vochuoi|votao)_(0[1-9]|1[0-2])$'
    or asset_id ~ '^images/trash/(vo_hop_sua|vo_hop_giay|giay_cu|vo_chai|ong_nhua|vo_keo|vo_lon|vo_chai_nhua|xuong_ca|dui_ga|vo_dua_hau|banh_mi|la_cay|vo_chuoi|vo_tao)$';
$$;

create table if not exists public.game_assets (
  id text primary key check (public.valid_game_asset_id(id)),
  revision uuid not null
);
alter table public.game_assets enable row level security;
grant select, insert, update on public.game_assets to anon, authenticated;

drop policy if exists "game public read" on public.game_assets;
create policy "game public read" on public.game_assets for select to anon, authenticated using (true);
drop policy if exists "game public insert" on public.game_assets;
create policy "game public insert" on public.game_assets for insert to anon, authenticated
  with check (public.valid_game_asset_id(id));
drop policy if exists "game public update" on public.game_assets;
create policy "game public update" on public.game_assets for update to anon, authenticated
  using (public.valid_game_asset_id(id)) with check (public.valid_game_asset_id(id));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('kien-sang', 'kien-sang', true, 5242880, array[
  'image/png', 'image/jpeg', 'image/webp',
  'audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/webm', 'audio/ogg', 'audio/mp4'
])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "game files read" on storage.objects;
create policy "game files read" on storage.objects for select to anon, authenticated
  using (bucket_id = 'kien-sang');
drop policy if exists "game files insert" on storage.objects;
create policy "game files insert" on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'kien-sang' and public.valid_game_asset_id(name));
drop policy if exists "game files update" on storage.objects;
create policy "game files update" on storage.objects for update to anon, authenticated
  using (bucket_id = 'kien-sang' and public.valid_game_asset_id(name))
  with check (bucket_id = 'kien-sang' and public.valid_game_asset_id(name));
