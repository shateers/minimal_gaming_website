import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getUserScores } from "@/services/scoreService";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const Profile = () => {
  const { user, profile, signOut } = useAuth();
  const [userScores, setUserScores] = useState<any[]>([]);
  const [username, setUsername] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchUserScores();
    }
    
    if (profile) {
      setUsername(profile.username || "");
    }
  }, [user, profile]);

  const fetchUserScores = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await getUserScores(user.id);
      if (error) throw error;
      setUserScores(data || []);
    } catch (error: any) {
      console.error("Error fetching user scores:", error);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await updateProfile({
        username,
      });
      
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: any) => {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user?.id)
      .select();
      
    return { data, error };
  };

  const formatGameTime = (seconds: number) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 px-6 md:px-10 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
            <p className="mb-6">Please sign in to view your profile.</p>
            <Link
              to="/signin"
              className="bg-primary text-primary-foreground py-2 px-4 rounded-md font-medium"
            >
              Sign In
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 px-6 md:px-10 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <Link
                to="/"
                className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4"
              >
                <span className="mr-2">←</span> Back to home
              </Link>
              <h1 className="text-3xl font-bold">Your Profile</h1>
            </div>
            
            <button
              onClick={handleSignOut}
              className="px-4 py-2 border border-input rounded-md hover:bg-secondary/50 transition-colors"
            >
              Sign Out
            </button>
          </div>
          
          <div className="bg-card rounded-lg shadow-sm border border-border p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="bg-primary/10 rounded-full w-24 h-24 flex items-center justify-center text-2xl font-bold">
                {profile?.username?.charAt(0) || user.email?.charAt(0) || "U"}
              </div>
              
              <div className="flex-grow">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium mb-1">
                        Username
                      </label>
                      <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full md:w-80 px-3 py-2 border border-input rounded-md"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdateProfile}
                        disabled={loading}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium disabled:opacity-70"
                      >
                        {loading ? "Saving..." : "Save"}
                      </button>
                      
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setUsername(profile?.username || "");
                        }}
                        className="px-4 py-2 border border-input rounded-md"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-xl font-semibold">
                      {profile?.username || "User"}
                    </h2>
                    <p className="text-muted-foreground">{user.email}</p>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="mt-2 text-sm text-primary hover:underline"
                    >
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg shadow-sm border border-border p-6">
            <h2 className="text-xl font-semibold mb-4">Game History</h2>
            
            {userScores.length === 0 ? (
              <p className="text-muted-foreground">
                You haven't played any games yet. Start playing to see your scores here!
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Game</th>
                      <th className="text-left py-2 px-4">Score</th>
                      <th className="text-left py-2 px-4">Time</th>
                      <th className="text-left py-2 px-4">Moves</th>
                      <th className="text-left py-2 px-4">Difficulty</th>
                      <th className="text-left py-2 px-4">Status</th>
                      <th className="text-left py-2 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userScores.map((score) => (
                      <tr key={score.id} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-4 capitalize">{score.game_name}</td>
                        <td className="py-2 px-4">{score.score}</td>
                        <td className="py-2 px-4">{score.time_taken ? formatGameTime(score.time_taken) : "N/A"}</td>
                        <td className="py-2 px-4">{score.moves || "N/A"}</td>
                        <td className="py-2 px-4 capitalize">{score.difficulty || "N/A"}</td>
                        <td className="py-2 px-4">{score.completed ? "Completed" : "In Progress"}</td>
                        <td className="py-2 px-4">{new Date(score.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
