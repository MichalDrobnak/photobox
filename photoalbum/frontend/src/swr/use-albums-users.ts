import useSWR from 'swr';
import { AlbumUser } from '../models/album-user';
import { fetcher } from '../utils/fetcher';
import { SwrData } from './swr-data';
import { AlbumCategoryFilter } from '../components/CategoryFilter/CategoryFilter';
import { PaginationData } from '../models/pagination-data';

export const useAlbumsUsers = (
  userId: number,
  page: number,
  pageSize: number,
  filter: AlbumCategoryFilter | null
): SwrData<{ results: AlbumUser[]; meta: PaginationData }> => {
  const categoryFilter = filter?.category
    ? `&filter{album.categories.name.icontains}=${filter.category}`
    : '';

  const ownerFilter = filter?.user
    ? `&filter{album.owner.id}=${filter.user.id}`
    : '';

  const { data, error } = useSWR(
    `${
      import.meta.env.VITE_BASE_URL
    }api/albumuser/?page=${page}&per_page=${pageSize}&filter{user}=${userId}${categoryFilter}${ownerFilter}`,
    fetcher
  );

  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
};
