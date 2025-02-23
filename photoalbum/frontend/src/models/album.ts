import { User } from './user';

export interface Album {
  id: number;
  public: boolean;
  name: string;
  created_at: string;
  updated_at: string;
  owner: number;
  categories: string[];
  links: Record<string, string>;
}

export type AlbumWithUser = Omit<Album, 'owner'> & { owner: User };
