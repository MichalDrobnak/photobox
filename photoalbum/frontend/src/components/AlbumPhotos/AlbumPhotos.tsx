import {
  Alert,
  Button,
  Group,
  Modal,
  Pagination,
  SimpleGrid,
  Skeleton,
  Text,
} from '@mantine/core';
import axios from 'axios';
import { FunctionComponent, useState } from 'react';
import { AlertCircle } from 'tabler-icons-react';
import { Photo } from '../../models/photo';
import { useAlbumPhotos } from '../../swr/use-album-photos';
import { AlbumPhotosFilter } from '../AlbumFilter/AlbumFilter';
import PhotoCard from '../PhotoCard/PhotoCard';

interface AlbumPhotosProps {
  albumId: number;
  filter: AlbumPhotosFilter | null;
}

// Paginator page size.
const PAGE_SIZE = 3;

const AlbumPhotos: FunctionComponent<AlbumPhotosProps> = ({
  albumId,
  filter,
}) => {
  // Pagination active page.
  const [activePage, setPage] = useState(1);

  // Whether photo is currently being deleted.
  const [deleting, setDeleting] = useState(false);

  // Whether delete check modal window is open.
  const [photoToDelete, setPhotoToDelete] = useState<number | null>(null);

  // Album photos fetched with SWR.
  const { data, isLoading, isError, mutate } = useAlbumPhotos(
    albumId,
    activePage,
    PAGE_SIZE,
    filter
  );
  const photos = data?.results;

  const onLikeClick = (photo: Photo): void => {
    axios
      .post(
        import.meta.env.VITE_BASE_URL +
          `api/photo/${photo.id}/${photo.liked ? 'unlike' : 'like'}`,
        {},
        {
          withCredentials: true,
        }
      )
      .then(() => {
        const newPhotos = [...photos];
        const indexOfPhoto = photos.indexOf(photo);
        newPhotos[indexOfPhoto].liked = true;
        mutate({ results: newPhotos, meta: data.meta });
      });
  };

  const onDeleteClick = (photoId: number): void => {
    setPhotoToDelete(photoId);
  };

  const deletePhoto = (): void => {
    setDeleting(true);

    axios
      .delete(import.meta.env.VITE_BASE_URL + `api/photo/${photoToDelete}/`, {
        withCredentials: true,
      })
      .then(() => {
        if (photos.length === 1 && activePage > 1) {
          setPage(activePage - 1);
        }
        mutate(null, { revalidate: true });
      })
      .finally(() => {
        setDeleting(false);
        setPhotoToDelete(null);
      });
  };

  return (
    <>
      <Modal
        opened={photoToDelete !== null}
        onClose={() => setPhotoToDelete(null)}
        title="Are you sure you want to delete this photo?">
        <Group position="right">
          <Button variant="light" onClick={() => setPhotoToDelete(null)}>
            Close
          </Button>
          <Button onClick={deletePhoto} loading={deleting}>
            Yes
          </Button>
        </Group>
      </Modal>

      <SimpleGrid
        cols={1}
        breakpoints={[
          { minWidth: 'md', cols: 2 },
          { minWidth: 'lg', cols: 3 },
        ]}>
        {isLoading && (
          <>
            <Skeleton height="18rem"></Skeleton>
            <Skeleton height="18rem"></Skeleton>
            <Skeleton height="18rem"></Skeleton>
          </>
        )}
        {photos &&
          photos.map(photo => (
            <PhotoCard
              photo={photo}
              key={photo.id}
              onDeleteClick={() => onDeleteClick(photo.id)}
              onLikeClick={() => onLikeClick(photo)}></PhotoCard>
          ))}
      </SimpleGrid>

      {isError && (
        <Alert icon={<AlertCircle size={16} />} title="Error" color="red">
          Something went wrong!
        </Alert>
      )}

      {photos && photos.length > 0 && (
        <Pagination
          total={data.meta.total_pages}
          mt="lg"
          size="md"
          grow
          page={activePage}
          onChange={setPage}
        />
      )}

      {photos && photos.length === 0 && (
        <Text color="gray">Album contains no photos.</Text>
      )}
    </>
  );
};

export default AlbumPhotos;
