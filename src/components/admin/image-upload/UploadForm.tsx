
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface UploadFormProps {
  isUploading: boolean;
  error: string | null;
  onFileSelect: (file: File) => void;
}

const UploadForm = ({ isUploading, error, onFileSelect }: UploadFormProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      onFileSelect(event.target.files[0]);
    }
  };
  
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
      onFileSelect(e.dataTransfer.files[0]);
    }
  };
  
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div 
        className={`border-2 border-dashed rounded-lg p-6 w-full text-center transition-colors ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm font-medium">
            Drag and drop your image here, or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            PNG, JPG or GIF up to 5MB
          </p>
          
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleChange}
            disabled={isUploading}
            className="hidden"
          />
          
          <Button 
            variant="outline" 
            disabled={isUploading}
            onClick={() => document.getElementById('image')?.click()}
            className="mt-2"
          >
            {isUploading ? "Uploading..." : selectedFile ? "Change File" : "Select File"}
          </Button>
          
          {selectedFile && (
            <p className="text-xs mt-2">
              Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
            </p>
          )}
        </div>
      </div>
      
      {isUploading && (
        <div className="w-full">
          <p className="text-xs text-center mb-1">Uploading...</p>
          <Progress value={50} className="h-2" />
        </div>
      )}
    </div>
  );
};

export default UploadForm;
