ALTER TABLE timeline_entries ADD COLUMN location text NOT NULL DEFAULT '';
ALTER TABLE timeline_entries ADD COLUMN location_type text NOT NULL DEFAULT '';
ALTER TABLE timeline_entries ADD COLUMN employment_type text NOT NULL DEFAULT '';
ALTER TABLE timeline_entries ADD COLUMN is_current integer NOT NULL DEFAULT 0;
ALTER TABLE timeline_entries ADD COLUMN start_month text NOT NULL DEFAULT '';
ALTER TABLE timeline_entries ADD COLUMN start_year text NOT NULL DEFAULT '';
ALTER TABLE timeline_entries ADD COLUMN end_month text NOT NULL DEFAULT '';
ALTER TABLE timeline_entries ADD COLUMN end_year text NOT NULL DEFAULT '';
