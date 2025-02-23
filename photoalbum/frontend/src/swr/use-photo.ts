import useSWR from 'swr';
import { Photo } from '../models/photo';
import { fetcher } from '../utils/fetcher';
import { SwrData } from './swr-data';

export const usePhoto = (id: number): SwrData<{ results: Photo }> => {
  const { data, error } = useSWR(
    `${import.meta.env.VITE_BASE_URL}api/photo/${id}`,
    fetcher
  );

  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
};
