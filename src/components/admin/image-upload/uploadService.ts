
import { supabase } from "@/integrations/supabase/client";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export interface UploadValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateImageFile = (file: File): UploadValidationResult => {
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

export const uploadGameImage = async (
  file: File,
  gameId: string,
  gameTitle: string
): Promise<{ publicUrl: string } | { error: Error }> => {
  try {
    const normalizedGameId = gameId || gameTitle.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const fileExt = file.name.split('.').pop();
    const fileName = `${normalizedGameId}-${Date.now()}`;
    const filePath = `assets/images/${fileName}.${fileExt}`;
    
    // Check if bucket exists before uploading
    const { data: buckets } = await supabase.storage.listBuckets();
    const gameAssetsBucketExists = buckets?.some(bucket => bucket.name === 'game-assets');
    
    if (!gameAssetsBucketExists) {
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

export const updateGameImageInDatabase = async (gameId: string, imageUrl: string) => {
  return await supabase
    .from('games')
    .update({ image_url: imageUrl })
    .eq('id', gameId);
};
