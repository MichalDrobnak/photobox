import { Alert, Pagination, Skeleton, Stack, Text } from '@mantine/core';
import { FunctionComponent, useState } from 'react';
import CompactAlbum from '../CompactAlbum/CompactAlbum';
import { AlbumCategoryFilter } from '../CategoryFilter/CategoryFilter';
import { useAlbumsUsers } from '../../swr/use-albums-users';
import { AlertCircle } from 'tabler-icons-react';
import { useAuth } from '../../auth';
import { useAllAlbums } from '../../swr/use-all-album';
import { Album } from '../../models/album';
import { PaginationData } from '../../models/pagination-data';

interface AlbumsProps {
  filter: AlbumCategoryFilter | null;
}

const PAGE_SIZE = 3;

const Albums: FunctionComponent<AlbumsProps> = ({ filter }) => {
  const [activePage, setPage] = useState(1);
  const { user } = useAuth();
  let albums: Album[];
  let isLoading: boolean;
  let isError: boolean;
  let paginationData: PaginationData;

  if (filter !== null && filter.public == true) {
    const {
      data,
      isLoading: areAlbumsLoading,
      isError: isAlbumsError,
    } = useAllAlbums(activePage, PAGE_SIZE, filter);

    albums = data?.results;
    isLoading = areAlbumsLoading;
    isError = isAlbumsError;
    paginationData = data?.meta;
  } else {
    const {
      data,
      isLoading: areAlbumsLoading,
      isError: isAlbumsError,
    } = useAlbumsUsers(user.id, activePage, PAGE_SIZE, filter);

    albums = data?.results.map(result => result.album);
    isLoading = areAlbumsLoading;
    isError = isAlbumsError;
    paginationData = data?.meta;
  }

  return (
    <>
      <Stack>
        {isLoading && (
          <>
            <Skeleton></Skeleton>
            <Skeleton></Skeleton>
            <Skeleton></Skeleton>
          </>
        )}
        {albums &&
          albums.map(album => (
            <CompactAlbum {...album} key={album.id}></CompactAlbum>
          ))}
      </Stack>

      {isError && (
        <Alert icon={<AlertCircle size={16} />} title="Error" color="red">
          Something went wrong!
        </Alert>
      )}

      {albums && albums.length !== 0 && (
        <Pagination
          total={paginationData.total_pages}
          mt="lg"
          size="md"
          grow
          page={activePage}
          onChange={setPage}
        />
      )}

      {albums && albums.length === 0 && (
        <Text color="grey"> No matching albums!</Text>
      )}
    </>
  );
};

export default Albums;
