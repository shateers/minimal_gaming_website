
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useAdminCheck = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        navigate('/signin');
        return;
      }
      
      try {
        // Add timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
          setIsLoading(false);
          setError("Connection timeout. Please try again.");
          toast({
            title: "Connection timeout",
            description: "Failed to verify admin status. Please refresh and try again.",
            variant: "destructive",
          });
        }, 10000); // 10 second timeout
        
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();
          
        clearTimeout(timeoutId);
        
        if (error) {
          throw error;
        }
        
        if (!data || data.is_admin !== true) {
          toast({
            title: "Access Denied",
            description: "You don't have admin privileges",
            variant: "destructive",
          });
          navigate('/');
          return;
        }
        
        setIsAdmin(true);
        setError(null);
      } catch (error: any) {
        setError(error.message);
        toast({
          title: "Error fetching admin status",
          description: error.message,
          variant: "destructive",
        });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdmin();
  }, [user, navigate, toast]);

  return { isAdmin, isLoading, error };
};
