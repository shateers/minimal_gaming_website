
import { Image as ImageIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface StorageAlertProps {
  error: string | null;
}

const StorageAlert = ({ error }: StorageAlertProps) => {
  return (
    <div className="mb-6">
      <Alert>
        <ImageIcon className="h-4 w-4" />
        <AlertTitle>Image Management</AlertTitle>
        <AlertDescription>
          To upload images for games, make sure the storage bucket has been properly configured.
          {error && error.includes("bucket") && (
            <div className="mt-2">
              <p className="text-sm text-red-600">
                Storage bucket configuration issue detected. Please check your Supabase storage settings.
              </p>
            </div>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default StorageAlert;
