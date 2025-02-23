import { Album } from './album';

export interface AlbumUser {
  id: number;
  liked: boolean;
  permissions: 0 | 1 | 2 | 3;
  album: Album;
  user: number;
}
