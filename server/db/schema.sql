-- Mend Sure database schema
-- Run this whole file once in the Supabase SQL editor (SQL Editor -> New query -> paste -> Run).

create extension if not exists "pgcrypto";

create table if not exists treatments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  specialty text not null,
  description text,
  price_min_usd numeric,
  price_max_usd numeric,
  avg_price_usa_usd numeric,
  package_inclusions text[],
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists hospitals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  city text,
  description text,
  accreditations text[],
  image_url text,
  is_placeholder boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists hospital_treatments (
  id uuid primary key default gen_random_uuid(),
  hospital_id uuid not null references hospitals(id) on delete cascade,
  treatment_id uuid not null references treatments(id) on delete cascade,
  price_min_usd numeric,
  price_max_usd numeric,
  unique (hospital_id, treatment_id)
);

create table if not exists doctors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  specialty text,
  hospital_id uuid references hospitals(id) on delete set null,
  experience_years integer,
  bio text,
  image_url text,
  is_placeholder boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  patient_name text not null,
  country text,
  treatment text,
  quote text not null,
  image_url text,
  is_placeholder boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  country text,
  treatment_interested text,
  message text,
  status text not null default 'new',
  source_page text,
  created_at timestamptz not null default now()
);

-- Row-level security is left ON with no policies for every table above.
-- The API server uses the Supabase service-role key, which bypasses RLS entirely,
-- so this has no effect on the app. It's just a safety net: if the wrong key
-- (e.g. the public anon key) ever ends up somewhere it shouldn't, these tables
-- return nothing instead of being wide open.
alter table treatments enable row level security;
alter table hospitals enable row level security;
alter table hospital_treatments enable row level security;
alter table doctors enable row level security;
alter table testimonials enable row level security;
alter table inquiries enable row level security;
