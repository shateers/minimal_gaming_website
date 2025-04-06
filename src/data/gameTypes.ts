
export interface Game {
  title: string;
  description: string;
  href: string;
  imageSrc?: string;
  id?: string; // Adding an id field to uniquely identify games
}

export interface GameCategory {
  name: string;
  games: Game[];
}

// Admin type for checking permissions
export interface AdminPermission {
  isAdmin: boolean;
}
