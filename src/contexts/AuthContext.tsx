
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: {
    is_admin?: boolean;
    username?: string;
    avatar_url?: string;
  } | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any, data: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
  profileLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{
    is_admin?: boolean;
    username?: string;
    avatar_url?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  
  // Use a ref to track fetch attempts to prevent duplicate calls
  const profileFetchAttempted = useRef<{[key: string]: boolean}>({});

  // Function to fetch profile data, with caching to prevent duplicate fetches
  async function fetchProfile(userId: string) {
    // Prevent duplicate fetches for the same user in the same session
    if (profileFetchAttempted.current[userId]) return;
    
    setProfileLoading(true);
    profileFetchAttempted.current[userId] = true;
    
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("is_admin, username, avatar_url")
        .eq("id", userId)
        .single();
        
      if (!error && data) {
        setProfile({
          is_admin: data.is_admin,
          username: data.username,
          avatar_url: data.avatar_url
        });
      } else {
        console.error("Error fetching profile:", error);
        setProfile(null);
      }
    } catch (error) {
      console.error("Exception fetching profile:", error);
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  }

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch profile data after session is established
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setLoading(false);
      }
    };
    
    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (event === 'SIGNED_IN' && newSession?.user) {
          // Clear the fetch attempt record on sign in so we get fresh data
          profileFetchAttempted.current = {};
          fetchProfile(newSession.user.id);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
          // Clear the fetch attempts on sign out
          profileFetchAttempted.current = {};
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } finally {
      // Loading will be set to false by the onAuthStateChange handler
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      return { data, error };
    } finally {
      // Loading will be set to false by the onAuthStateChange handler
    }
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    // Loading and profile will be updated by the onAuthStateChange handler
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        signIn,
        signUp,
        signOut,
        loading,
        profileLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
