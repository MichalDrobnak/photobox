import useSWR from 'swr';
import { User } from '../models/user';
import { fetcher } from '../utils/fetcher';
import { SwrData } from './swr-data';

export const useUser = (id?: number): SwrData<{ results: User }> => {
  const { data, error } = useSWR(
    id ? `${import.meta.env.VITE_BASE_URL}api/users/${id}` : null,
    fetcher
  );

  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
};
