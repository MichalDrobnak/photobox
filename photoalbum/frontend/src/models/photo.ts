export interface Photo {
  id: number;
  image: string;
  caption: string;
  liked: boolean;
  albums: number[];
  owner: number;
  links: Record<string, string>;
}
