-- Royal Keys initial production schema.
-- Apply to a dedicated Supabase/PostgreSQL project after review.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role text not null default 'broker' check (role in ('admin','broker','viewer')),
  created_at timestamptz not null default now()
);

create table if not exists public.owners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  mobile text not null,
  email text not null,
  verified boolean not null default false,
  verification_notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  public_ref text not null unique,
  transaction_type text not null check (transaction_type in ('sale','rent')),
  property_type text not null check (property_type in ('apartment','house','land','commercial','villa')),
  status text not null default 'pending_review' check (status in ('draft','pending_review','live','under_offer','sold','rented','archived')),
  owner_id uuid not null references public.owners(id) on delete restrict,
  title text not null,
  slug text not null,
  district text not null,
  city text not null,
  address_hint text not null default '',
  exact_address text,
  price numeric(18,2) not null check (price > 0),
  bedrooms integer,
  bathrooms integer,
  area_sqft numeric(12,2),
  land_perches numeric(12,2),
  furnished text check (furnished in ('furnished','semi_furnished','unfurnished')),
  description text not null default '',
  amenities jsonb not null default '[]'::jsonb,
  images jsonb not null default '[]'::jsonb,
  available_from date,
  featured boolean not null default false,
  owner_authorization_confirmed boolean not null default false,
  marketing_readiness integer not null default 0 check (marketing_readiness between 0 and 100),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists properties_search_idx on public.properties(transaction_type,status,district,city,property_type,price);
create index if not exists properties_owner_idx on public.properties(owner_id);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  public_ref text not null unique,
  transaction_type text not null check (transaction_type in ('sale','rent')),
  name text not null,
  mobile text not null,
  email text not null,
  budget_min numeric(18,2) not null default 0,
  budget_max numeric(18,2) not null default 0,
  preferred_cities jsonb not null default '[]'::jsonb,
  property_types jsonb not null default '[]'::jsonb,
  bedrooms integer,
  timeline text not null check (timeline in ('immediate','30_days','90_days','researching')),
  funding_method text not null check (funding_method in ('cash','bank_loan','mixed','not_applicable')),
  move_in_date date,
  lease_months integer,
  viewing_ready boolean not null default false,
  verified_contact boolean not null default false,
  score integer not null default 0 check (score between 0 and 100),
  temperature text not null default 'cold' check (temperature in ('hot','warm','cold')),
  status text not null default 'new' check (status in ('new','qualified','viewing','negotiating','won','lost')),
  source text not null default 'Website',
  notes text not null default '',
  assigned_to uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_pipeline_idx on public.leads(transaction_type,status,temperature,score desc);

create table if not exists public.introductions (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete restrict,
  lead_id uuid not null references public.leads(id) on delete restrict,
  method text not null check (method in ('interest','viewing','offer','application','manual')),
  introduced_at timestamptz not null default now(),
  protection_until timestamptz not null,
  acknowledged_by_owner_at timestamptz,
  status text not null default 'active' check (status in ('active','expired','converted')),
  created_at timestamptz not null default now(),
  unique(property_id, lead_id)
);

create index if not exists introductions_protection_idx on public.introductions(status, protection_until);

create table if not exists public.viewings (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  starts_at timestamptz not null,
  status text not null default 'requested' check (status in ('requested','confirmed','completed','cancelled','no_show')),
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  amount numeric(18,2) not null check (amount > 0),
  funding_method text not null check (funding_method in ('cash','bank_loan','mixed')),
  completion_days integer not null default 30,
  status text not null default 'submitted' check (status in ('submitted','countered','accepted','declined','withdrawn')),
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.rental_applications (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  proposed_move_in_date date not null,
  lease_months integer not null check (lease_months > 0),
  occupants integer not null check (occupants > 0),
  occupation text not null default '',
  pets boolean not null default false,
  status text not null default 'submitted' check (status in ('submitted','shortlisted','accepted','declined','withdrawn')),
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.deals (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete restrict,
  lead_id uuid not null references public.leads(id) on delete restrict,
  transaction_type text not null check (transaction_type in ('sale','rent')),
  final_amount numeric(18,2) not null check (final_amount > 0),
  status text not null default 'open' check (status in ('open','won','lost')),
  won_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.commissions (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null unique references public.deals(id) on delete restrict,
  transaction_type text not null check (transaction_type in ('sale','rent')),
  base_amount numeric(18,2) not null,
  rate numeric(8,5) not null,
  amount numeric(18,2) not null,
  status text not null default 'expected' check (status in ('expected','invoiced','paid')),
  invoiced_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id text not null,
  action text not null,
  detail text not null default '',
  actor_id uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  due_at timestamptz,
  priority text not null default 'medium' check (priority in ('low','medium','high')),
  status text not null default 'open' check (status in ('open','done','cancelled')),
  related_type text,
  related_id text,
  assigned_to uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Staff authorization helper. SECURITY DEFINER is used so RLS can inspect profiles safely.
create or replace function public.is_royal_keys_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin','broker','viewer')
  );
$$;

alter table public.profiles enable row level security;
alter table public.owners enable row level security;
alter table public.properties enable row level security;
alter table public.leads enable row level security;
alter table public.introductions enable row level security;
alter table public.viewings enable row level security;
alter table public.offers enable row level security;
alter table public.rental_applications enable row level security;
alter table public.deals enable row level security;
alter table public.commissions enable row level security;
alter table public.activities enable row level security;
alter table public.tasks enable row level security;

-- Never grant anonymous users direct SELECT access to the base property table because
-- RLS filters rows, not sensitive columns such as exact_address / owner_id.
revoke all on public.properties from anon;
grant select, insert, update, delete on public.properties to authenticated;

-- Safe marketplace projection. The view intentionally contains no owner PII or exact address.
create or replace view public.property_marketplace as
select
  id, public_ref, transaction_type, property_type, status, title, slug, district, city,
  address_hint, price, bedrooms, bathrooms, area_sqft, land_perches, furnished,
  description, amenities, images, available_from, featured, marketing_readiness,
  created_at, updated_at
from public.properties
where status in ('live','under_offer');

revoke all on public.property_marketplace from public;
grant select on public.property_marketplace to anon, authenticated;

-- Staff policies.
create policy "staff can read profiles" on public.profiles for select using (public.is_royal_keys_staff());
create policy "staff can manage owners" on public.owners for all using (public.is_royal_keys_staff()) with check (public.is_royal_keys_staff());
create policy "staff can manage properties" on public.properties for all using (public.is_royal_keys_staff()) with check (public.is_royal_keys_staff());
create policy "staff can manage leads" on public.leads for all using (public.is_royal_keys_staff()) with check (public.is_royal_keys_staff());
create policy "staff can manage introductions" on public.introductions for all using (public.is_royal_keys_staff()) with check (public.is_royal_keys_staff());
create policy "staff can manage viewings" on public.viewings for all using (public.is_royal_keys_staff()) with check (public.is_royal_keys_staff());
create policy "staff can manage offers" on public.offers for all using (public.is_royal_keys_staff()) with check (public.is_royal_keys_staff());
create policy "staff can manage rental applications" on public.rental_applications for all using (public.is_royal_keys_staff()) with check (public.is_royal_keys_staff());
create policy "staff can manage deals" on public.deals for all using (public.is_royal_keys_staff()) with check (public.is_royal_keys_staff());
create policy "staff can manage commissions" on public.commissions for all using (public.is_royal_keys_staff()) with check (public.is_royal_keys_staff());
create policy "staff can manage activities" on public.activities for all using (public.is_royal_keys_staff()) with check (public.is_royal_keys_staff());
create policy "staff can manage tasks" on public.tasks for all using (public.is_royal_keys_staff()) with check (public.is_royal_keys_staff());

-- Public lead intake can be added via a server function / Edge Function using service credentials.
-- Do not create anonymous INSERT policies for owners/leads/documents without rate limiting, validation and abuse controls.
