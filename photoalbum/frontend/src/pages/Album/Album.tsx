import { Anchor, Modal, SimpleGrid } from '@mantine/core';
import { Center } from '@mantine/core';
import { Skeleton } from '@mantine/core';
import { Alert } from '@mantine/core';
import { Button, Container, Group, Title } from '@mantine/core';
import axios from 'axios';
import { FunctionComponent, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useSWR, { useSWRConfig } from 'swr';
import { AlertCircle } from 'tabler-icons-react';
import { useAuth } from '../../auth';
import AlbumFilter, {
  AlbumPhotosFilter,
} from '../../components/AlbumFilter/AlbumFilter';
import AlbumPhotos from '../../components/AlbumPhotos/AlbumPhotos';
import CompactAlbum from '../../components/CompactAlbum/CompactAlbum';
import { useAlbum } from '../../swr/use-album';
import { fetcher } from '../../utils/fetcher';

const Album: FunctionComponent<{}> = () => {
  // Route parameters.
  const params = useParams();

  // For logged in user data.
  const { user } = useAuth();

  // For programatical navigation (e.g. after delete).
  const navigate = useNavigate();

  // SWR config for applying mutations.
  const swrConfig = useSWRConfig();

  // Whether album is currently being deleted.
  const [deleting, setDeleting] = useState(false);

  // Whether delete check modal window is open.
  const [deleteCheckOpened, setDeleteCheckOpened] = useState(false);

  // Current filter for photos.
  const [photosFilter, setPhotosFilter] = useState<AlbumPhotosFilter | null>(
    null
  );

  // Fetch album.
  const {
    data: albumData,
    isLoading: albumIsLoading,
    isError: albumIsError,
  } = useAlbum(Number(params.id));
  const album = albumData?.results;

  // Fetch albumUser (doesn't fetch if album is undefined).
  const { data: albumUserData } = useSWR(
    album
      ? `${import.meta.env.VITE_BASE_URL}api/albumuser?filter{album}=${
          album.id
        }&filter{user}=${user.id}`
      : null,
    fetcher
  );
  const albumUser = albumUserData?.results[0];

  const deleteAlbum = (): void => {
    setDeleting(true);

    axios
      .delete(import.meta.env.VITE_BASE_URL + `api/album/${album.id}`, {
        withCredentials: true,
      })
      .then(() => navigate('/'))
      .catch(() => setDeleting(false));
  };

  const onLikeClick = (): void => {
    if (albumUser) {
      likeAlbum();
    } else {
      createNewAlbumUserAndLike();
    }
  };

  const likeAlbum = (): void => {
    axios
      .patch(
        import.meta.env.VITE_BASE_URL + `api/albumuser/${albumUser.id}`,
        {
          liked: !albumUser.liked,
        },
        { withCredentials: true }
      )
      .then(() => {
        swrConfig.mutate(
          `${import.meta.env.VITE_BASE_URL}api/albumuser?filter{album}=${
            album.id
          }&filter{user}=${user.id}`
        );
      });
  };

  const createNewAlbumUserAndLike = (): void => {
    axios
      .post(
        import.meta.env.VITE_BASE_URL + 'api/albumuser',
        {
          liked: true,
          permissions: 0,
          album: album.id,
          user: user.id,
        },
        { withCredentials: true }
      )
      .then(() => {
        swrConfig.mutate(
          `${import.meta.env.VITE_BASE_URL}api/albumuser?filter{album}=${
            album.id
          }&filter{user}=${user.id}`
        );
      });
  };

  if (albumIsLoading) {
    return (
      <Container size="xl">
        <Skeleton height="5rem" mb="md"></Skeleton>
        <div style={{ width: '50%' }}>
          <Skeleton height="2rem" mb="md"></Skeleton>
          <Skeleton height="2rem" mb="md"></Skeleton>
          <Skeleton height="2rem" mb="md"></Skeleton>
        </div>

        <SimpleGrid
          cols={1}
          breakpoints={[
            { minWidth: 'md', cols: 2 },
            { minWidth: 'lg', cols: 3 },
          ]}>
          <Skeleton height="13rem"></Skeleton>
          <Skeleton height="13rem"></Skeleton>
          <Skeleton height="13rem"></Skeleton>
        </SimpleGrid>
      </Container>
    );
  }

  if (albumIsError) {
    return (
      <Center>
        <Alert icon={<AlertCircle size={16} />} title="Error" color="red">
          Something went wrong!
        </Alert>
      </Center>
    );
  }

  return (
    <Container size="xl">
      <Modal
        opened={deleteCheckOpened}
        onClose={() => setDeleteCheckOpened(false)}
        title="Are you sure you want to delete this album?">
        <Group position="right">
          <Button variant="light" onClick={() => setDeleteCheckOpened(false)}>
            Close
          </Button>
          <Button onClick={deleteAlbum} loading={deleting}>
            Yes
          </Button>
        </Group>
      </Modal>

      {album && (
        <>
          <Group position="apart" pb="xl">
            <Title order={1}>Album</Title>
            <Group position="right">
              <Anchor component={Link} to="permissions">
                <Button compact>Manage permissions</Button>
              </Anchor>
              <Anchor component={Link} to="upload-photo">
                <Button compact>Upload photo</Button>
              </Anchor>
            </Group>
          </Group>

          <CompactAlbum
            {...{
              id: album.id,
              categories: album.categories,
              name: album.name,
              liked: albumUser?.liked,
              owner: album.owner,
              showSettingsBtn: true,
              onDeleteClick: () => setDeleteCheckOpened(true),
              onLikeClick,
            }}></CompactAlbum>

          <Title order={2} mt="xl" mb="sm">
            Filter
          </Title>
          <AlbumFilter
            applyFilter={filter => setPhotosFilter(filter)}></AlbumFilter>

          <Title order={2} mt="xl" mb="sm">
            Photos
          </Title>
          <AlbumPhotos filter={photosFilter} albumId={album.id}></AlbumPhotos>
        </>
      )}
    </Container>
  );
};

export default Album;
