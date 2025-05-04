
import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useAdminCheck = () => {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use refs to track navigation and prevent infinite loops
  const hasNavigatedRef = useRef(false);
  const checkAttemptedRef = useRef(false);
  const timeoutIdRef = useRef<number | null>(null);
  
  // Use the cached admin value from AuthContext if available
  useEffect(() => {
    if (profile !== null) {
      setIsAdmin(profile.is_admin === true);
      if (!isLoading) return; // Don't set loading to false if we're still checking other things
      setIsLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    const checkAdmin = async () => {
      // Prevent multiple check attempts per render cycle
      if (checkAttemptedRef.current) return;
      checkAttemptedRef.current = true;
      
      // Don't run the check if we already have admin status from the profile
      if (isAdmin !== null) {
        setIsLoading(false);
        return;
      }

      if (!user) {
        // Only navigate if we haven't done so already and we're not on a sign-in page
        if (!hasNavigatedRef.current && 
            !location.pathname.includes('signin') && 
            !location.pathname.includes('signup')) {
          hasNavigatedRef.current = true;
          navigate('/signin');
        }
        setIsLoading(false);
        setIsAdmin(false);
        return;
      }
      
      try {
        // Add timeout to prevent infinite loading
        if (timeoutIdRef.current) {
          clearTimeout(timeoutIdRef.current);
        }
        
        timeoutIdRef.current = window.setTimeout(() => {
          if (isLoading) {
            setIsLoading(false);
            setError("Connection timeout. Please try again.");
            toast({
              title: "Connection timeout",
              description: "Failed to verify admin status. Please refresh and try again.",
              variant: "destructive",
            });
          }
        }, 10000); // 10 second timeout
        
        // First check if the profile is already loaded with admin status
        if (profile) {
          setIsAdmin(profile.is_admin === true);
          clearTimeout(timeoutIdRef.current);
          timeoutIdRef.current = null;
          setIsLoading(false);
          setError(null);
          return;
        }
        
        // If not, fetch from database
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();
          
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
        
        if (error) {
          throw error;
        }
        
        if (!data || data.is_admin !== true) {
          // Only show toast if we're on an admin page
          if (location.pathname.includes('/admin/') && !location.pathname.includes('/admin/signin')) {
            toast({
              title: "Access Denied",
              description: "You don't have admin privileges",
              variant: "destructive",
            });
            
            // Only navigate if we haven't done so already
            if (!hasNavigatedRef.current) {
              hasNavigatedRef.current = true;
              navigate('/');
            }
          }
          
          setIsAdmin(false);
          return;
        }
        
        setIsAdmin(true);
        // Call refreshProfile to update the AuthContext with the admin status
        refreshProfile();
        setError(null);
      } catch (error: any) {
        setError(error.message);
        
        // Only display toast and navigate if this is a legitimate error, not just a component unmounting
        if (!hasNavigatedRef.current) {
          toast({
            title: "Error fetching admin status",
            description: error.message,
            variant: "destructive",
          });
          
          hasNavigatedRef.current = true;
          navigate('/');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdmin();
    
    return () => {
      // Clean up timeout
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
      
      // Reset navigation flag when leaving the component
      hasNavigatedRef.current = false;
      checkAttemptedRef.current = false;
    };
  }, [user, navigate, toast, location.pathname, isAdmin, profile, refreshProfile]);

  return { isAdmin, isLoading, error };
};
