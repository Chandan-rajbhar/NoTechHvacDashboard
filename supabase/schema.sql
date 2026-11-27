-- ==============================================================================
-- No-Tech HVAC Admin Console — Initial PostgreSQL Schema & RLS Policies
-- ==============================================================================
-- Run this script in your Supabase Dashboard -> SQL Editor (or via Supabase CLI).
-- It creates core domain tables, audit triggers, auth profile sync, and RLS.
-- ==============================================================================

-- Extensions
create extension if not exists "pgcrypto";

-- ==============================================================================
-- 1. Shared Trigger Functions
-- ==============================================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ==============================================================================
-- 2. Users (Linked 1:1 with auth.users)
-- ==============================================================================
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text unique not null,
  role text not null default 'Operator'
    check (role in ('Super Admin', 'Operations Manager', 'LM Reviewer', 'Contractor', 'Investor', 'Customer', 'Operator')),
  status text not null default 'Active'
    check (status in ('Active', 'Inactive')),
  phone text,
  avatar_url text,
  last_login timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_users_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

-- Helper for RLS policies: checks if current authenticated user is an admin/staff
create or replace function public.is_admin_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users
    where id = auth.uid()
      and role in ('Super Admin', 'Operations Manager', 'LM Reviewer')
  );
$$;

-- Auto-create user row when a new user signs up in auth.users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Sync real last_sign_in_at from auth.users to public.users.last_login
create or replace function public.sync_user_last_login()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.users
  set last_login = new.last_sign_in_at
  where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_last_login on auth.users;
create trigger on_auth_user_last_login
  after insert or update of last_sign_in_at on auth.users
  for each row
  when (new.last_sign_in_at is not null)
  execute function public.sync_user_last_login();

-- ==============================================================================
-- 3. Customers (Linked 1:1 with public.users via user_id)
-- ==============================================================================
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references public.users(id) on delete cascade,
  customer_code text unique,
  address text,
  city text,
  state text,
  zip text,
  region text,
  property_sqft integer,
  tonnage text,
  configuration text,
  panel_color text default '#373A3C',
  panel_color_name text default 'Dark Gray (Default)',
  batch_number text,
  reservation_fee_paid boolean not null default false,
  estimated_fulfillment_date date,
  assigned_contractor_id uuid,
  assigned_contractor_name text,
  install_status text not null default 'Pending'
    check (install_status in ('Pending', 'In Production', 'Scheduled', 'Installed', 'Deactivated')),
  scheduled_date date,
  scheduled_slot text,
  unselect_history jsonb not null default '[]'::jsonb,
  notes jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_customers_user_id on public.customers(user_id);

create trigger trg_customers_updated_at
  before update on public.customers
  for each row execute function public.set_updated_at();

-- Auto-create linked customer row whenever a user has role = 'Customer'
create or replace function public.sync_customer_user_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role = 'Customer' then
    insert into public.customers (user_id, customer_code)
    values (
      new.id,
      'CUST-' || upper(substr(replace(new.id::text, '-', ''), 1, 6))
    )
    on conflict (user_id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_user_customer_role_sync on public.users;
create trigger on_user_customer_role_sync
  after insert or update of role on public.users
  for each row execute function public.sync_customer_user_role();

-- ==============================================================================
-- 4. Contractors
-- ==============================================================================
create table if not exists public.contractors (
  id uuid primary key default gen_random_uuid(),
  external_ref text unique,
  company_name text not null,
  contact_name text not null,
  email text not null,
  phone text,
  region text,
  epa_certified boolean not null default false,
  coi_verified boolean not null default false,
  approval_status text not null default 'Pending'
    check (approval_status in ('Pending', 'Approved', 'Rejected', 'Suspended')),
  rating numeric(3, 2) default 0.00,
  completed_jobs integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_contractors_status on public.contractors(approval_status);

create trigger trg_contractors_updated_at
  before update on public.contractors
  for each row execute function public.set_updated_at();

-- ==============================================================================
-- 5. Reservations & Batch Tracking
-- ==============================================================================
create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  batch_code text unique not null,
  customer_id uuid references public.customers(id) on delete set null,
  customer_name text not null,
  region text not null,
  tonnage text not null,
  configuration text not null,
  color_code text,
  status text not null default 'Pending'
    check (status in ('Pending', 'Pre-Calibration', 'Ready for Dispatch', 'In Transit', 'Installed', 'Cancelled')),
  total_amount numeric(12, 2) not null default 0,
  deposit_paid numeric(12, 2) not null default 0,
  scheduled_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_reservations_status on public.reservations(status);
create index if not exists idx_reservations_customer on public.reservations(customer_id);

create trigger trg_reservations_updated_at
  before update on public.reservations
  for each row execute function public.set_updated_at();

-- ==============================================================================
-- 6. Installations & Quality Control (QC)
-- ==============================================================================
create table if not exists public.installations_qc (
  id uuid primary key default gen_random_uuid(),
  job_code text unique not null,
  reservation_id uuid references public.reservations(id) on delete set null,
  contractor_id uuid references public.contractors(id) on delete set null,
  customer_name text not null,
  location text,
  delta_t numeric(5, 2),
  qc_status text not null default 'Pending Review'
    check (qc_status in ('Pending Review', 'Passed', 'Flagged', 'Correction Submitted')),
  notes text,
  inspected_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_installations_qc_status on public.installations_qc(qc_status);

create trigger trg_installations_qc_updated_at
  before update on public.installations_qc
  for each row execute function public.set_updated_at();

-- ==============================================================================
-- 7. Payments
-- ==============================================================================
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  transaction_ref text unique not null,
  reservation_id uuid references public.reservations(id) on delete set null,
  payer_name text not null,
  amount numeric(12, 2) not null,
  payment_type text not null default 'Deposit',
  status text not null default 'Completed'
    check (status in ('Pending', 'Completed', 'Failed', 'Refunded')),
  paid_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- ==============================================================================
-- 8. Investors & Allocation Requests
-- ==============================================================================
create table if not exists public.investors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  firm text,
  email text not null,
  tier text,
  committed_amount numeric(14, 2) not null default 0,
  status text not null default 'Active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_investors_updated_at
  before update on public.investors
  for each row execute function public.set_updated_at();

create table if not exists public.allocation_requests (
  id uuid primary key default gen_random_uuid(),
  investor_id uuid references public.investors(id) on delete cascade,
  round_name text not null,
  requested_amount numeric(14, 2) not null,
  status text not null default 'Pending'
    check (status in ('Pending', 'Approved', 'Declined')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_allocation_requests_updated_at
  before update on public.allocation_requests
  for each row execute function public.set_updated_at();

-- ==============================================================================
-- 9. System Settings (Key/Value JSONB)
-- ==============================================================================
create table if not exists public.system_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_by uuid references public.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create trigger trg_system_settings_updated_at
  before update on public.system_settings
  for each row execute function public.set_updated_at();

-- ==============================================================================
-- 10. Row Level Security (RLS)
-- ==============================================================================
alter table public.users enable row level security;
alter table public.customers enable row level security;
alter table public.contractors enable row level security;
alter table public.reservations enable row level security;
alter table public.installations_qc enable row level security;
alter table public.payments enable row level security;
alter table public.investors enable row level security;
alter table public.allocation_requests enable row level security;
alter table public.system_settings enable row level security;

-- Users: users can view/update their own row; admins can manage all users
create policy "Users can view own row"
  on public.users for select
  using (auth.uid() = id or public.is_admin_user());

create policy "Users can update own row"
  on public.users for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Admins can manage all users"
  on public.users for all
  using (public.is_admin_user())
  with check (public.is_admin_user());

-- Admin-managed domain tables
create policy "Admins full access on customers"
  on public.customers for all
  using (public.is_admin_user())
  with check (public.is_admin_user());

create policy "Customers can view own record"
  on public.customers for select
  using (auth.uid() = user_id);

create policy "Admins full access on contractors"
  on public.contractors for all
  using (public.is_admin_user())
  with check (public.is_admin_user());

create policy "Admins full access on reservations"
  on public.reservations for all
  using (public.is_admin_user())
  with check (public.is_admin_user());

create policy "Admins full access on installations_qc"
  on public.installations_qc for all
  using (public.is_admin_user())
  with check (public.is_admin_user());

create policy "Admins full access on payments"
  on public.payments for all
  using (public.is_admin_user())
  with check (public.is_admin_user());

create policy "Admins full access on investors"
  on public.investors for all
  using (public.is_admin_user())
  with check (public.is_admin_user());

create policy "Admins full access on allocation_requests"
  on public.allocation_requests for all
  using (public.is_admin_user())
  with check (public.is_admin_user());

create policy "Admins full access on system_settings"
  on public.system_settings for all
  using (public.is_admin_user())
  with check (public.is_admin_user());
