
import { useEffect, ReactNode } from "react";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface AdminCheckerProps {
  children: ReactNode;
}

const AdminChecker = ({ children }: AdminCheckerProps) => {
  const { isAdmin, isLoading, error } = useAdminCheck();
  const navigate = useNavigate();

  // If still checking admin status, show loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-16 pt-24">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col items-center justify-center h-64">
              <div className="text-xl font-semibold mb-4">Checking admin privileges...</div>
              <div className="flex space-x-2">
                <div className="h-3 w-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="h-3 w-3 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="h-3 w-3 bg-primary rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // If not admin, show access denied
  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-16 pt-24">
          <div className="max-w-6xl mx-auto">
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Access Denied</AlertTitle>
              <AlertDescription>
                Admin privileges are required to access this page.
                {error && (
                  <div className="mt-2 text-sm">
                    Error: {error}
                  </div>
                )}
              </AlertDescription>
            </Alert>
            <Button onClick={() => navigate("/signin")}>
              Go to Sign In
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // If admin, render children
  return <>{children}</>;
};

export default AdminChecker;
