-- Mend Sure — schema updates (enquiry funnel + listings follow-up)
-- Run this AFTER schema.sql, seed.sql, and auth-schema.sql.

-- Lets a "get a free quote" submission be linked to a logged-in patient's
-- account when they're logged in. Still nullable — guests can submit too.
alter table inquiries add column if not exists user_id uuid references auth.users(id) on delete set null;

-- Richer hospital listing data.
alter table hospitals add column if not exists bed_count integer;
alter table hospitals add column if not exists departments text[];
alter table hospitals add column if not exists gallery_urls text[];
