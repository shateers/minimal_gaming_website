
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [processingAdmin, setProcessingAdmin] = useState(false);
  const [progressValue, setProgressValue] = useState(10);
  const { signIn, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if this is an admin login attempt based on URL
  const isAdminLogin = location.pathname.includes('/admin');

  // Update progress bar for loading animations
  useEffect(() => {
    if (loading) {
      const timer = setInterval(() => {
        setProgressValue((prev) => {
          if (prev >= 90) {
            clearInterval(timer);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      return () => clearInterval(timer);
    } else {
      setProgressValue(10);
    }
  }, [loading]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Special case for admin login with hardcoded credentials
      if (email === "admin@gmail.com" && password === "admin@1234") {
        setProcessingAdmin(true);
        
        // First try normal sign in
        const { error } = await signIn(email, password);
        
        if (error) {
          console.log("Admin login error:", error);
          // If the admin user doesn't exist yet, create it
          if (error.message.includes("Invalid login credentials")) {
            // First create the user
            const { error: signUpError, data } = await supabase.auth.signUp({
              email,
              password,
            });
            
            if (signUpError) {
              throw signUpError;
            }
            
            toast({
              title: "Creating admin account",
              description: "Please wait while we set up your admin account...",
            });
            
            // Wait a moment to ensure the user is created and auth hooks are triggered
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Then update their profile to be an admin
            if (data?.user) {
              const { error: profileError } = await supabase
                .from('profiles')
                .update({ is_admin: true })
                .eq('id', data.user.id);
              
              if (profileError) {
                throw profileError;
              }
              
              // Now sign in with the new account
              const { error: signInError } = await signIn(email, password);
              if (signInError) {
                throw signInError;
              }
            }
          } else {
            throw error;
          }
        }
        
        // Add delay before checking profile to ensure DB has updated
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check if the user is an admin
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', (await supabase.auth.getUser()).data.user?.id)
          .single();

        if (profileError) {
          throw profileError;
        }

        // Update the profile to ensure is_admin is true
        if (!profileData || profileData.is_admin !== true) {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ is_admin: true })
            .eq('id', (await supabase.auth.getUser()).data.user?.id);
            
          if (updateError) {
            throw updateError;
          }
          
          // Wait for update to complete before proceeding
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        toast({
          title: "Welcome Admin!",
          description: "You have successfully signed in.",
        });
        
        setProcessingAdmin(false);
        
        // Add a small delay before navigation to ensure state is updated
        setTimeout(() => {
          navigate("/admin/games");
        }, 500);
        return;
      }
      
      // Regular user signin
      const { error } = await signIn(email, password);
      
      if (error) {
        throw error;
      }

      toast({
        title: "Sign in successful!",
        description: "Welcome back to Shateer Games.",
      });
      
      // Check if the user is an admin if they're trying to access admin pages
      if (isAdminLogin) {
        // Wait for profile to be fetched
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (profile?.is_admin) {
          navigate("/admin/games");
        } else {
          // If not admin but trying to access admin pages, redirect to home
          toast({
            title: "Not an admin",
            description: "You don't have admin privileges. Redirecting to home page.",
            variant: "destructive",
          });
          navigate("/");
        }
      } else {
        // Regular user - redirect to home
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive",
      });
      setProcessingAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 px-6 md:px-10 pb-16">
        <div className="max-w-md mx-auto">
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <span className="mr-2">←</span> Back to home
            </Link>
            <h1 className="text-3xl font-bold">{isAdminLogin ? "Admin Sign In" : "Sign In"}</h1>
            <p className="text-muted-foreground mt-2">
              {isAdminLogin 
                ? "Please enter your admin credentials to continue." 
                : "Please enter your credentials to continue."}
            </p>
          </div>

          {(loading || processingAdmin) && (
            <div className="mb-6">
              <p className="text-sm text-center mb-2">
                {processingAdmin ? "Setting up admin account..." : "Signing in..."}
              </p>
              <Progress value={progressValue} className="h-2" />
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading || processingAdmin}
                className="w-full px-3 py-2 border border-input rounded-md disabled:opacity-70"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading || processingAdmin}
                className="w-full px-3 py-2 border border-input rounded-md disabled:opacity-70"
              />
            </div>

            <button
              type="submit"
              disabled={loading || processingAdmin}
              className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium disabled:opacity-70"
            >
              {loading ? "Signing in..." : (isAdminLogin ? "Sign In as Admin" : "Sign In")}
            </button>

            {!isAdminLogin && (
              <div className="text-center text-sm">
                <p>
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </p>
              </div>
            )}
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SignIn;
