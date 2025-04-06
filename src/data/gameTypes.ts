
export interface Game {
  title: string;
  description: string;
  href: string;
  imageSrc?: string;  // Legacy field for image source
  image_url?: string; // New field for Supabase storage URL
  id?: string;        // ID field to uniquely identify games
}

export interface GameCategory {
  name: string;
  games: Game[];
}

// Admin type for checking permissions
export interface AdminPermission {
  isAdmin: boolean;
}
