
export interface Game {
  title: string;
  description: string;
  href: string;
  imageSrc?: string;
}

export interface GameCategory {
  name: string;
  games: Game[];
}
