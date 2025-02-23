import useSWR from 'swr';
import { Album } from '../models/album';
import { fetcher } from '../utils/fetcher';
import { SwrData } from './swr-data';

export const useAlbum = (id: number): SwrData<{ results: Album }> => {
  const { data, error } = useSWR(
    `${import.meta.env.VITE_BASE_URL}api/album/${id}`,
    fetcher
  );

  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
};
