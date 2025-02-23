export interface Category {
  slug: string;
  name: string;
  use_count: number;
  photos: number[];
  albums: number[];
  links: Record<string, string>;
}
