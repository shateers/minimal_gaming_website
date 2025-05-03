
import { ShieldAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AdBlockWarning = () => {
  return (
    <Alert variant="warning" className="mb-6">
      <ShieldAlert className="h-4 w-4" />
      <AlertTitle>AdBlock Notice</AlertTitle>
      <AlertDescription>
        Some images may be blocked by ad blockers. We've implemented fallbacks,
        but for best experience, consider temporarily disabling ad blockers on this page.
      </AlertDescription>
    </Alert>
  );
};

export default AdBlockWarning;
