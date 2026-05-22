-- Payment methods & bank details (run after schema-v3-services.sql)
-- Single row — editable from /admin/payment

create table if not exists public.payment_settings (
  id text primary key default 'default',
  title text not null default 'Appointment fees for procurement',
  fee_amount numeric not null default 35000,
  fee_amount_label text not null default 'N35,000 (Thirty Five Thousand Naira)',
  bank_name text not null default 'The Alternative Bank',
  account_number text not null default '0511151496',
  account_name text not null default 'DARBOI CONSULTS LIMITED',
  after_payment_note text not null default 'After payment, enter your transfer reference or depositor name below.',
  paystack_enabled boolean not null default true,
  flutterwave_enabled boolean not null default true,
  show_bank_transfer boolean not null default true,
  updated_at timestamptz not null default now()
);

insert into public.payment_settings (id)
values ('default')
on conflict (id) do nothing;

alter table public.payment_settings enable row level security;

create policy "Public read payment settings"
  on public.payment_settings for select to anon, authenticated
  using (true);
