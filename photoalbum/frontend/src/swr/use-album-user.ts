import useSWR from 'swr';
import { AlbumUser } from '../models/album-user';
import { fetcher } from '../utils/fetcher';
import { SwrData } from './swr-data';

export const useAlbumUser = (id: number): SwrData<{ results: AlbumUser }> => {
  const { data, error } = useSWR(
    `${import.meta.env.VITE_BASE_URL}api/albumuser/${id}`,
    fetcher
  );

  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
};
