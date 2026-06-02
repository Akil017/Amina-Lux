-- ============================================
-- AMINA LUXE — Supabase Database Schema
-- ============================================
-- Run this entire file in:
-- Supabase Dashboard > SQL Editor > New Query
-- Then click "Run"
-- ============================================


-- 1. PROFILES (linked to Supabase auth users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  name text,
  phone text,
  role text not null default 'customer' check (role in ('admin', 'customer')),
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'customer');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- 2. PRODUCTS
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric(10,2) not null,
  original_price numeric(10,2),
  category text not null,
  subcategory text,
  sizes text[] default '{}',
  colors text[] default '{}',
  stock integer not null default 0,
  images text[] default '{}',
  featured boolean default false,
  new_arrival boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger products_updated_at
  before update on public.products
  for each row execute function update_updated_at();


-- 3. ORDERS
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  status text not null default 'pending'
    check (status in ('pending','confirmed','shipped','delivered','cancelled')),
  total numeric(10,2) not null,
  shipping_address jsonb,
  payment_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger orders_updated_at
  before update on public.orders
  for each row execute function update_updated_at();


-- 4. ORDER ITEMS
create table if not exists public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  quantity integer not null default 1,
  size text,
  color text,
  price numeric(10,2) not null
);


-- 5. WISHLIST
create table if not exists public.wishlist (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);


-- ============================================
-- ROW LEVEL SECURITY (RLS) — IMPORTANT!
-- ============================================

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.wishlist enable row level security;

-- Profiles: users can read/update their own
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Admins can view all profiles" on public.profiles for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Products: anyone can read, only admins can write
create policy "Anyone can view products" on public.products for select using (true);
create policy "Admins can insert products" on public.products for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can update products" on public.products for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can delete products" on public.products for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Orders: users see own, admins see all
create policy "Users can view own orders" on public.orders for select using (auth.uid() = user_id);
create policy "Users can insert orders" on public.orders for insert with check (auth.uid() = user_id);
create policy "Users can update own orders" on public.orders for update using (auth.uid() = user_id);
create policy "Admins can view all orders" on public.orders for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can update all orders" on public.orders for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Order items
create policy "Users can view own order items" on public.order_items for select using (
  exists (select 1 from public.orders where id = order_id and user_id = auth.uid())
);
create policy "Users can insert order items" on public.order_items for insert with check (
  exists (select 1 from public.orders where id = order_id and user_id = auth.uid())
);
create policy "Admins can view all order items" on public.order_items for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Wishlist
create policy "Users can manage own wishlist" on public.wishlist for all using (auth.uid() = user_id);


-- ============================================
-- MAKE YOURSELF ADMIN
-- ============================================
-- After you sign up on the website with your email,
-- run this query (replace with your actual email):
--
-- update public.profiles set role = 'admin' where email = 'your-email@gmail.com';
-- update public.profiles set role = 'admin' where email = 'sisters-email@gmail.com';
-- ============================================
