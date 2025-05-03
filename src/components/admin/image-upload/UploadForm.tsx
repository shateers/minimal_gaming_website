
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface UploadFormProps {
  isUploading: boolean;
  error: string | null;
  onFileSelect: (file: File) => void;
}

const UploadForm = ({ isUploading, error, onFileSelect }: UploadFormProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onFileSelect(event.target.files[0]);
    }
  };
  
  return (
    <div className="flex flex-col items-center gap-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Input
        id="image"
        type="file"
        accept="image/*"
        onChange={handleChange}
        disabled={isUploading}
      />
    </div>
  );
};

export default UploadForm;
