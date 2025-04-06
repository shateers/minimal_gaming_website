
-- This is not executed directly, but documents what needs to be done manually in Supabase
-- Create a new storage bucket for game assets if it doesn't exist yet
CREATE BUCKET IF NOT EXISTS game-assets;

-- Set the RLS policy for the bucket to allow authenticated users to read
-- This is handled via the Supabase dashboard, not directly via SQL
