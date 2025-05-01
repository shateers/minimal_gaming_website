
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Special case for admin login with hardcoded credentials
      if (email === "admin@gmail.com" && password === "admin@1234") {
        const { error } = await signIn(email, password);
        
        if (error) {
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
            
            // Then update their profile to be an admin
            if (data.user) {
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
        if (profileData && !profileData.is_admin) {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ is_admin: true })
            .eq('id', (await supabase.auth.getUser()).data.user?.id);
            
          if (updateError) {
            throw updateError;
          }
        }
        
        toast({
          title: "Welcome Admin!",
          description: "You have successfully signed in.",
        });
        
        navigate("/admin/games");
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
      
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive",
      });
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
            <h1 className="text-3xl font-bold">Sign In</h1>
            <p className="text-muted-foreground mt-2">
              Please enter your credentials to continue.
            </p>
          </div>

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
                className="w-full px-3 py-2 border border-input rounded-md"
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
                className="w-full px-3 py-2 border border-input rounded-md"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium disabled:opacity-70"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <div className="text-center text-sm">
              <p>
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SignIn;
