-- ============================================
-- Settle — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- Entries table
create table if not exists entries (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  amount      numeric(10, 2) not null check (amount > 0),
  category    text not null check (category in (
    'Eating Out', 'Travel', 'Health & Body',
    'Home & Living', 'Joy', 'Creating', 'Other'
  )),
  note        text,
  date        date not null,
  created_at  timestamptz not null default now()
);

-- Index for fast per-user queries
create index if not exists entries_user_date
  on entries(user_id, date desc);

-- Row Level Security: users only see their own entries
alter table entries enable row level security;

create policy "Users can read own entries"
  on entries for select
  using (auth.uid() = user_id);

create policy "Users can insert own entries"
  on entries for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own entries"
  on entries for delete
  using (auth.uid() = user_id);
