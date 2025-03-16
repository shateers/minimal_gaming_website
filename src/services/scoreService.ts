
import { supabase } from "@/integrations/supabase/client";

export type GameScore = {
  id?: string;
  user_id: string;
  game_name: string;
  score: number;
  time_taken?: number | null;
  moves?: number | null;
  difficulty?: string | null;
  completed: boolean;
};

export async function saveGameScore(score: Omit<GameScore, "id">) {
  return await supabase
    .from("game_scores")
    .insert(score)
    .select()
    .single();
}

export async function getGameScores(game_name?: string) {
  let query = supabase
    .from("game_scores")
    .select(`
      *,
      profiles:user_id (
        username,
        avatar_url
      )
    `)
    .order("score", { ascending: false });
  
  if (game_name) {
    query = query.eq("game_name", game_name);
  }
  
  return await query.limit(100);
}

export async function getUserScores(userId: string, game_name?: string) {
  let query = supabase
    .from("game_scores")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  
  if (game_name) {
    query = query.eq("game_name", game_name);
  }
  
  return await query.limit(20);
}
