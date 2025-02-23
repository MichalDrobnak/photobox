import useSWR, { KeyedMutator } from 'swr';
import { AlbumUser } from '../models/album-user';
import { fetcher } from '../utils/fetcher';
import { SwrData } from './swr-data';

export const usePermissions = (
  albumId: number
): SwrData<{
  results: AlbumUser[];
}> & { mutate: KeyedMutator<any> } => {
  const { data, error, mutate } = useSWR(
    `${import.meta.env.VITE_BASE_URL}api/albumuser?filter{album}=${albumId}`,
    fetcher
  );

  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};
