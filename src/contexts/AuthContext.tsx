
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
  refreshProfile: () => Promise<void>;
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
  const authChangeHandlerRef = useRef<boolean>(false);

  // Function to fetch profile data, with caching to prevent duplicate fetches
  const fetchProfile = async (userId: string) => {
    // Skip if already loading
    if (profileLoading) return;
    
    setProfileLoading(true);
    
    try {
      console.log("Fetching profile for user:", userId);
      const { data, error } = await supabase
        .from("profiles")
        .select("is_admin, username, avatar_url")
        .eq("id", userId)
        .single();
        
      if (error) {
        console.error("Error fetching profile:", error);
        // Check if the error is "No rows found" - this likely means the profile doesn't exist yet
        if (error.code === "PGRST116") {
          console.log("Profile doesn't exist, creating one...");
          // Create a new profile for the user
          const { error: createError } = await supabase
            .from("profiles")
            .insert({ id: userId })
            .select()
            .single();
            
          if (createError) {
            throw createError;
          }
          
          // Set default profile values
          setProfile({
            is_admin: false,
            username: null,
            avatar_url: null
          });
        } else {
          throw error;
        }
      } else if (data) {
        console.log("Profile data fetched:", data);
        setProfile({
          is_admin: data.is_admin,
          username: data.username,
          avatar_url: data.avatar_url
        });
      }
    } catch (error) {
      console.error("Exception fetching profile:", error);
      setProfile(null);
    } finally {
      setProfileLoading(false);
      // Mark that this profile has been fetched
      profileFetchAttempted.current[userId] = true;
    }
  };

  // Function to manually refresh profile data
  const refreshProfile = async () => {
    if (!user) return;
    
    // Reset fetch attempt for the user to force a refresh
    if (user.id in profileFetchAttempted.current) {
      delete profileFetchAttempted.current[user.id];
    }
    
    await fetchProfile(user.id);
  };

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        console.log("Initializing auth...");
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log("Session found, fetching profile...");
          // Fetch profile data after session is established
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };
    
    // Avoid duplicate initialization
    if (!authChangeHandlerRef.current) {
      initializeAuth();
      authChangeHandlerRef.current = true;

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, newSession) => {
          console.log("Auth state changed:", event);
          
          // Always update session and user
          setSession(newSession);
          setUser(newSession?.user ?? null);
          
          if (event === 'SIGNED_IN' && newSession?.user) {
            console.log("User signed in, fetching profile...");
            // Clear the fetch attempt record on sign in so we get fresh data
            profileFetchAttempted.current = {};
            fetchProfile(newSession.user.id);
          } else if (event === 'SIGNED_OUT') {
            console.log("User signed out, clearing profile...");
            setProfile(null);
            // Clear the fetch attempts on sign out
            profileFetchAttempted.current = {};
          }
          
          setLoading(false);
        }
      );

      return () => {
        subscription.unsubscribe();
        authChangeHandlerRef.current = false;
      }
    }
  }, []);

  useEffect(() => {
    // If session changes and we have a user but no profile, fetch it
    if (user && !profile && !profileLoading && !profileFetchAttempted.current[user.id]) {
      fetchProfile(user.id);
    }
  }, [user, profile, profileLoading]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log("Signing in with email:", email);
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
      console.log("Signing up with email:", email);
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
    console.log("Signing out...");
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
        refreshProfile,
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
