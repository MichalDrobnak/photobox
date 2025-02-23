import useSWR, { KeyedMutator } from 'swr';
import { AlbumPhotosFilter } from '../components/AlbumFilter/AlbumFilter';
import { PaginationData } from '../models/pagination-data';
import { Photo } from '../models/photo';
import { fetcher } from '../utils/fetcher';
import { SwrData } from './swr-data';

export const useAlbumPhotos = (
  albumId: number,
  page: number,
  pageSize: number,
  filter: AlbumPhotosFilter | null
): SwrData<{ results: Photo[]; meta: PaginationData }> & {
  mutate: KeyedMutator<any>;
} => {
  const captionFilter = filter?.caption
    ? `&filter{caption.icontains}=${filter.caption}`
    : '';

  const userFilter = filter?.user ? `&filter{owner}=${filter.user.id}` : '';

  const { data, error, mutate } = useSWR(
    `${
      import.meta.env.VITE_BASE_URL
    }api/photo/?page=${page}&per_page=${pageSize}&filter{albums}=${albumId}${captionFilter}${userFilter}`,
    fetcher
  );

  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};
