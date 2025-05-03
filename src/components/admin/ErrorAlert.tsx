
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorAlertProps {
  error: string | null;
  handleRetry: () => void;
}

const ErrorAlert = ({ error, handleRetry }: ErrorAlertProps) => {
  if (!error) return null;
  
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Failed to load games</AlertTitle>
      <AlertDescription>
        {error}
        <div className="mt-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleRetry}
          >
            Try Again
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ErrorAlert;
