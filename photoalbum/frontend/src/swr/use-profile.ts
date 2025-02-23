import useSWR, { KeyedMutator } from 'swr';
import { User } from '../models/user';
import { fetcher } from '../utils/fetcher';
import { SwrData } from './swr-data';

export const useProfile = (): SwrData<User | null> & {
  mutate: KeyedMutator<any>;
} => {
  const { data, error, mutate } = useSWR(
    `${import.meta.env.VITE_BASE_URL}api/users/profile/`,
    fetcher
  );

  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};
