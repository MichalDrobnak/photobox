import { Alert, Container, Skeleton, Title } from '@mantine/core';
import axios from 'axios';
import { FunctionComponent, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSWRConfig } from 'swr';
import { AlertCircle } from 'tabler-icons-react';
import { useAuth } from '../../auth';
import AlbumForm, {
  AlbumFormValue,
} from '../../components/AlbumForm/AlbumForm';
import { useAlbum } from '../../swr/use-album';

const AlbumSettings: FunctionComponent<{}> = () => {
  const params = useParams();
  const { user } = useAuth();
  const { data, isLoading, isError } = useAlbum(Number(params.id));
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(false);
  const swrConfig = useSWRConfig();
  const album = data?.results;

  const onSubmit = ({
    categories,
    isPublic,
    ...rest
  }: AlbumFormValue): void => {
    setUpdating(true);
    setUpdateError(false);

    axios
      .put(
        import.meta.env.VITE_BASE_URL + `api/album/${params.id}`,
        {
          categories: Array.from(categories),
          owner: user.id,
          public: isPublic,
          ...rest,
        },
        {
          withCredentials: true,
        }
      )
      .then(() =>
        swrConfig.mutate(
          import.meta.env.VITE_BASE_URL + `api/album/${params.id}`
        )
      )
      .catch(() => setUpdateError(true))
      .finally(() => setUpdating(false));
  };

  return (
    <Container size="sm">
      <Title order={1} pb="xl">
        Album settings
      </Title>
      {album && (
        <AlbumForm
          onSubmit={onSubmit}
          defaultValue={{
            name: album.name,
            categories: new Set(album.categories),
            isPublic: album.public,
          }}
          posting={updating}
          editingMode></AlbumForm>
      )}
      {isLoading && (
        <>
          <Skeleton height="4rem" mb="md"></Skeleton>
          <Skeleton height="4rem" mb="md"></Skeleton>
          <Skeleton height="4rem" mb="md"></Skeleton>
        </>
      )}
      {isError && (
        <Alert
          icon={<AlertCircle size={16} />}
          title="Error"
          color="red"
          mt="md">
          Something went wrong! It&apos;s possible that this album doesn&apos;t
          exist.
        </Alert>
      )}
      {updateError && (
        <Alert
          icon={<AlertCircle size={16} />}
          title="Error"
          color="red"
          mt="md">
          Something went wrong!
        </Alert>
      )}
    </Container>
  );
};

export default AlbumSettings;
