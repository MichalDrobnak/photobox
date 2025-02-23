import {
  Alert,
  Button,
  Container,
  Group,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import axios from 'axios';
import { FunctionComponent, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AlertCircle } from 'tabler-icons-react';
import { usePhoto } from '../../swr/use-photo';

const PhotoSettings: FunctionComponent<{}> = () => {
  const params = useParams();
  const [success, setSuccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const { data } = usePhoto(Number(params.id));
  const photo = data?.results;

  const form = useForm<{ caption: string }>({
    initialValues: photo
      ? { caption: photo.caption }
      : {
          caption: '',
        },
    validate: values => ({
      caption: values.caption ? null : 'Field is required',
    }),
  });

  const updatePhoto = (formValue: { caption: string }): void => {
    setLoading(true);
    setSuccess(null);

    axios
      .patch(
        import.meta.env.VITE_BASE_URL + `api/photo/${params.id}`,
        formValue,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      )
      .then(() => setSuccess(true))
      .catch(() => setSuccess(false))
      .finally(() => setLoading(false));
  };

  return (
    <Container size="sm">
      <Title order={1} pb="xl">
        Photo Settings
      </Title>

      <form onSubmit={form.onSubmit(updatePhoto)}>
        <Stack>
          <TextInput
            label="Caption"
            placeholder="Caption..."
            required
            {...form.getInputProps('caption')}></TextInput>

          <Group position="right">
            <Button loading={loading} type="submit">
              Edit
            </Button>
          </Group>
        </Stack>
      </form>

      {success == true ? (
        <Alert
          icon={<AlertCircle size={16} />}
          title="Success"
          color="green"
          mt="md">
          Photo updated successfully!
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

export default PhotoSettings;
