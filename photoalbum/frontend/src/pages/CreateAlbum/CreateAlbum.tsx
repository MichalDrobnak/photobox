import { Alert, Container, Title } from '@mantine/core';
import { FunctionComponent, useState } from 'react';
import AlbumForm, {
  AlbumFormValue,
} from '../../components/AlbumForm/AlbumForm';
import axios from 'axios';
import { AlertCircle } from 'tabler-icons-react';

const CreateAlbum: FunctionComponent<{}> = () => {
  const [success, setSuccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = ({ name, isPublic, categories }: AlbumFormValue): void => {
    setLoading(true);

    axios
      .post(
        import.meta.env.VITE_BASE_URL + 'api/album',
        {
          name,
          public: isPublic,
          categories: Array.from(categories),
        },
        { withCredentials: true }
      )
      .then(() => setSuccess(true))
      .catch(() => setSuccess(false))
      .finally(() => setLoading(false));
  };

  return (
    <Container size="sm">
      <Title order={1} pb="xl">
        Create Album
      </Title>

      <AlbumForm onSubmit={onSubmit} posting={loading}></AlbumForm>

      {success == true ? (
        <Alert
          icon={<AlertCircle size={16} />}
          title="Added!"
          color="green"
          mt="md">
          Album successfully added!
        </Alert>
      ) : null}
      {success == false ? (
        <Alert
          icon={<AlertCircle size={16} />}
          title="Error"
          color="red"
          mt="md">
          Something went wrong!
        </Alert>
      ) : null}
    </Container>
  );
};

export default CreateAlbum;
