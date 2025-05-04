
import { supabase } from "@/integrations/supabase/client";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Types for image validation and upload results
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface UploadResult {
  publicUrl: string;
}

export interface UploadError {
  error: Error;
}

/**
 * Validates the image file before upload
 * @param file File to validate
 * @returns Validation result with error message if invalid
 */
export const validateImageFile = (file: File): ValidationResult => {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size exceeds the ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`
    };
  }
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    return {
      isValid: false,
      error: 'Only image files are allowed'
    };
  }
  
  return { isValid: true };
};

/**
 * Checks if the game-assets storage bucket exists
 */
export const checkGameAssetsBucket = async (): Promise<boolean> => {
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error("Error checking storage buckets:", error);
      return false;
    }
    
    return buckets?.some(bucket => bucket.name === 'game-assets') || false;
  } catch (err) {
    console.error("Failed to check buckets:", err);
    return false;
  }
};

/**
 * Generates a filename for the uploaded game image
 */
const generateImageFilename = (
  gameId: string,
  gameTitle: string,
  fileExt: string
): string => {
  const normalizedGameId = gameId || gameTitle.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const timestamp = Date.now();
  return `assets/images/${normalizedGameId}-${timestamp}.${fileExt}`;
};

/**
 * Uploads an image file to Supabase storage
 */
export const uploadGameImage = async (
  file: File,
  gameId: string,
  gameTitle: string
): Promise<UploadResult | UploadError> => {
  try {
    const fileExt = file.name.split('.').pop() || 'png';
    const filePath = generateImageFilename(gameId, gameTitle, fileExt);
    
    // Check if bucket exists before uploading
    const bucketExists = await checkGameAssetsBucket();
    
    if (!bucketExists) {
      throw new Error("Storage bucket not configured. Please contact administrator.");
    }
    
    // Upload the file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('game-assets')
      .upload(filePath, file, { upsert: true });
      
    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw uploadError;
    }
    
    // Get the public URL
    const { data } = supabase.storage
      .from('game-assets')
      .getPublicUrl(filePath);
      
    if (!data) {
      throw new Error('Failed to get public URL');
    }
    
    return { publicUrl: data.publicUrl };
    
  } catch (error) {
    console.error("Upload error details:", error);
    return { error: error as Error };
  }
};

/**
 * Updates the game image URL in the database
 */
export const updateGameImageInDatabase = async (gameId: string, imageUrl: string) => {
  const { data, error } = await supabase
    .from('games')
    .update({ image_url: imageUrl })
    .eq('id', gameId)
    .select();
    
  if (error) {
    console.error("Database update error:", error);
    throw error;
  }
  
  return { success: !!data, data };
};
