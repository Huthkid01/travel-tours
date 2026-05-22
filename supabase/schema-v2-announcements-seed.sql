-- Optional: seed default announcements (run after schema-v2.sql if admin list is empty)
insert into public.announcements (message, type, link, active, sort_order)
values
  ('New service available — Appointment Booking now open', 'service', '/services/appointment-booking', true, 1),
  ('Serbia warehouse jobs & work permits — apply now', 'promo', '/programs/serbia-warehouse-jobs', true, 2),
  ('Office hours extended for December consultations', 'notice', '/contact', true, 3),
  ('France & Turkey tourist visa support — book consultation', 'notice', '/programs/france-tourist-visa', true, 4)
;
