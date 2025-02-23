import useSWR from 'swr';
import { AlbumCategoryFilter } from '../components/CategoryFilter/CategoryFilter';
import { Album } from '../models/album';
import { PaginationData } from '../models/pagination-data';
import { fetcher } from '../utils/fetcher';
import { SwrData } from './swr-data';

export const useAllAlbums = (
  page: number,
  pageSize: number,
  filter: AlbumCategoryFilter | null
): SwrData<{
  results: Album[];
  meta: PaginationData;
}> => {
  const isPublicFilter = filter?.public
    ? `filter{public}=${filter.public}`
    : null;

  const { data, error } = useSWR(
    `${
      import.meta.env.VITE_BASE_URL
    }api/album/?page=${page}&per_page=${pageSize}${
      isPublicFilter ? `&${isPublicFilter}` : ''
    }`,
    fetcher
  );

  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
};
