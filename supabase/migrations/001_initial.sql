-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────
-- USERS (extends auth.users)
-- ─────────────────────────────────────────────────────────
create table public.users (
  id         uuid primary key references auth.users on delete cascade,
  name       text not null default '',
  position   text,
  company    text,
  photo_url  text,
  created_at timestamptz default now()
);

-- Auto-create user profile on sign-up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, name, photo_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────────────────────
-- SESSIONS
-- ─────────────────────────────────────────────────────────
create table public.sessions (
  id           uuid primary key default gen_random_uuid(),
  host_id      uuid references public.users not null,
  name         text not null,
  type         text check (type in ('open', 'closed')) default 'open',
  status       text check (status in ('active', 'completed', 'scheduled')) default 'active',
  cup_count    int  default 1 check (cup_count >= 1 and cup_count <= 10),
  created_at   timestamptz default now(),
  completed_at timestamptz
);

-- ─────────────────────────────────────────────────────────
-- SESSION MEMBERS
-- ─────────────────────────────────────────────────────────
create table public.session_members (
  id         uuid primary key default gen_random_uuid(),
  session_id uuid references public.sessions on delete cascade,
  user_id    uuid references public.users on delete cascade,
  joined_at  timestamptz default now(),
  unique(session_id, user_id)
);

-- ─────────────────────────────────────────────────────────
-- COFFEE SAMPLES (user collection)
-- ─────────────────────────────────────────────────────────
create table public.coffee_samples (
  id         uuid primary key default gen_random_uuid(),
  owner_id   uuid references public.users not null,
  type       text check (type in ('single_origin', 'espresso')) default 'single_origin',
  name       text not null,
  country    text,
  process    text,
  roaster    text,
  roast_date date,
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────────────────────
-- SESSION SAMPLES (samples in a session)
-- ─────────────────────────────────────────────────────────
create table public.session_samples (
  id               uuid primary key default gen_random_uuid(),
  session_id       uuid references public.sessions on delete cascade,
  coffee_sample_id uuid references public.coffee_samples on delete set null,
  position         int not null,
  blind_label      text,
  created_at       timestamptz default now()
);

-- ─────────────────────────────────────────────────────────
-- SCORES
-- ─────────────────────────────────────────────────────────
create table public.scores (
  id                uuid primary key default gen_random_uuid(),
  session_sample_id uuid references public.session_samples on delete cascade,
  user_id           uuid references public.users on delete cascade,
  fragrance         numeric(4,2) default 6.00 check (fragrance  between 6 and 10),
  flavor            numeric(4,2) default 6.00 check (flavor     between 6 and 10),
  aftertaste        numeric(4,2) default 6.00 check (aftertaste between 6 and 10),
  acidity           numeric(4,2) default 6.00 check (acidity    between 6 and 10),
  body              numeric(4,2) default 6.00 check (body       between 6 and 10),
  uniformity        numeric(4,2) default 10.0 check (uniformity between 6 and 10),
  balance           numeric(4,2) default 6.00 check (balance    between 6 and 10),
  clean_cup         numeric(4,2) default 10.0 check (clean_cup  between 6 and 10),
  sweetness         numeric(4,2) default 10.0 check (sweetness  between 6 and 10),
  overall           numeric(4,2) default 6.00 check (overall    between 6 and 10),
  final_score       numeric(5,2) generated always as (
    fragrance + flavor + aftertaste + acidity + body +
    uniformity + balance + clean_cup + sweetness + overall - 36
  ) stored,
  updated_at        timestamptz default now(),
  unique(session_sample_id, user_id)
);

-- ─────────────────────────────────────────────────────────
-- SCA FLAVOR WHEEL
-- ─────────────────────────────────────────────────────────
create table public.descriptor_groups (
  id       uuid primary key default gen_random_uuid(),
  name     text not null,
  color    text,
  position int  not null default 0
);

create table public.descriptor_subgroups (
  id       uuid primary key default gen_random_uuid(),
  group_id uuid references public.descriptor_groups on delete cascade,
  name     text not null,
  position int  not null default 0
);

create table public.descriptors (
  id           uuid primary key default gen_random_uuid(),
  subgroup_id  uuid references public.descriptor_subgroups on delete cascade,
  name         text not null,
  position     int  not null default 0
);

-- ─────────────────────────────────────────────────────────
-- SAMPLE NOTES (selected descriptors per score)
-- ─────────────────────────────────────────────────────────
create table public.sample_notes (
  id            uuid primary key default gen_random_uuid(),
  score_id      uuid references public.scores on delete cascade,
  descriptor_id uuid references public.descriptors on delete set null,
  custom_text   text,
  created_at    timestamptz default now()
);

-- ─────────────────────────────────────────────────────────
-- INVITES
-- ─────────────────────────────────────────────────────────
create table public.invites (
  id         uuid primary key default gen_random_uuid(),
  session_id uuid references public.sessions on delete cascade,
  email      text,
  token      text unique default encode(gen_random_bytes(16), 'hex'),
  used_at    timestamptz,
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────────
alter table public.users            enable row level security;
alter table public.sessions         enable row level security;
alter table public.session_members  enable row level security;
alter table public.coffee_samples   enable row level security;
alter table public.session_samples  enable row level security;
alter table public.scores           enable row level security;
alter table public.sample_notes     enable row level security;
alter table public.invites          enable row level security;
alter table public.descriptor_groups    enable row level security;
alter table public.descriptor_subgroups enable row level security;
alter table public.descriptors          enable row level security;

-- users: everyone can read, only self can write
create policy "users_select" on public.users for select using (true);
create policy "users_insert" on public.users for insert with check (id = auth.uid());
create policy "users_update" on public.users for update using (id = auth.uid());

-- sessions: open = all, closed = host or member
create policy "sessions_select" on public.sessions for select using (
  type = 'open' or
  host_id = auth.uid() or
  exists (select 1 from public.session_members m where m.session_id = id and m.user_id = auth.uid())
);
create policy "sessions_insert" on public.sessions for insert with check (host_id = auth.uid());
create policy "sessions_update" on public.sessions for update using (host_id = auth.uid());

-- session_members
create policy "members_select" on public.session_members for select using (
  exists (select 1 from public.sessions s where s.id = session_id and (
    s.type = 'open' or s.host_id = auth.uid() or
    exists (select 1 from public.session_members m2 where m2.session_id = session_id and m2.user_id = auth.uid())
  ))
);
create policy "members_insert" on public.session_members for insert with check (user_id = auth.uid());

-- coffee_samples: owner only
create policy "coffee_select" on public.coffee_samples for select using (owner_id = auth.uid());
create policy "coffee_insert" on public.coffee_samples for insert with check (owner_id = auth.uid());
create policy "coffee_update" on public.coffee_samples for update using (owner_id = auth.uid());
create policy "coffee_delete" on public.coffee_samples for delete using (owner_id = auth.uid());

-- session_samples: visible to session members
create policy "ss_select" on public.session_samples for select using (
  exists (select 1 from public.sessions s where s.id = session_id and (
    s.type = 'open' or s.host_id = auth.uid() or
    exists (select 1 from public.session_members m where m.session_id = session_id and m.user_id = auth.uid())
  ))
);
create policy "ss_insert" on public.session_samples for insert with check (
  exists (select 1 from public.sessions s where s.id = session_id and s.host_id = auth.uid())
);

-- scores: own insert/update, session members can read
create policy "scores_select" on public.scores for select using (
  exists (
    select 1 from public.session_samples ss
    join public.sessions s on s.id = ss.session_id
    where ss.id = session_sample_id and (
      s.type = 'open' or s.host_id = auth.uid() or
      exists (select 1 from public.session_members m where m.session_id = s.id and m.user_id = auth.uid())
    )
  )
);
create policy "scores_insert" on public.scores for insert with check (user_id = auth.uid());
create policy "scores_update" on public.scores for update using (user_id = auth.uid());

-- notes
create policy "notes_all" on public.sample_notes for all using (
  exists (select 1 from public.scores sc where sc.id = score_id and sc.user_id = auth.uid())
);

-- wheel descriptors: public read
create policy "dg_select"  on public.descriptor_groups    for select using (true);
create policy "dsg_select" on public.descriptor_subgroups for select using (true);
create policy "d_select"   on public.descriptors          for select using (true);

-- invites
create policy "invites_select" on public.invites for select using (
  exists (select 1 from public.sessions s where s.id = session_id and s.host_id = auth.uid())
);
create policy "invites_insert" on public.invites for insert with check (
  exists (select 1 from public.sessions s where s.id = session_id and s.host_id = auth.uid())
);

-- ─────────────────────────────────────────────────────────
-- REALTIME
-- ─────────────────────────────────────────────────────────
alter publication supabase_realtime add table public.scores;
alter publication supabase_realtime add table public.session_members;
alter publication supabase_realtime add table public.sessions;
