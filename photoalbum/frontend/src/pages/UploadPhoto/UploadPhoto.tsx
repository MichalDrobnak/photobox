import {
  Button,
  Container,
  Group,
  Stack,
  TextInput,
  Title,
  Text,
  MantineTheme,
  useMantineTheme,
  ActionIcon,
  Alert,
} from '@mantine/core';
import { Dropzone, DropzoneStatus, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useForm } from '@mantine/form';
import { FunctionComponent, useState } from 'react';
import React from 'react';
import {
  Photo,
  Upload,
  X,
  Icon as TablerIcon,
  AlertCircle,
} from 'tabler-icons-react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import CategorySelection from '../../components/CategorySelection/CategorySelection';

interface PhotoForm {
  caption: string;
  categories: Set<string>;
  photo?: File;
}

function getIconColor(status: DropzoneStatus, theme: MantineTheme) {
  return status.accepted
    ? theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]
    : status.rejected
    ? theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]
    : theme.colorScheme === 'dark'
    ? theme.colors.dark[0]
    : theme.colors.gray[7];
}

function ImageUploadIcon({
  status,
  ...props
}: React.ComponentProps<TablerIcon> & { status: DropzoneStatus }) {
  if (status.accepted) {
    return <Upload {...props} />;
  }

  if (status.rejected) {
    return <X {...props} />;
  }

  return <Photo {...props} />;
}

const dropzoneChildren = (
  status: DropzoneStatus,
  theme: MantineTheme,
  removeSelectedPhoto: () => void,
  file?: File
) => {
  const droppedFile = file && (
    <>
      <ActionIcon
        variant="light"
        color="red"
        onClick={() => removeSelectedPhoto()}>
        <X></X>
      </ActionIcon>
      <Text weight={600} color="gray">
        {file.name}
      </Text>
    </>
  );

  return (
    <Group position="center">
      {droppedFile || (
        <>
          <ImageUploadIcon
            status={status}
            style={{ color: getIconColor(status, theme) }}
            size={40}></ImageUploadIcon>
          <Text weight={600} color="gray">
            Upload a photo
          </Text>
        </>
      )}
    </Group>
  );
};

const UploadPhoto: FunctionComponent<{}> = () => {
  const form = useForm<PhotoForm>({
    initialValues: { caption: '', photo: undefined, categories: new Set() },
    validate: values => ({
      photo: values.photo ? null : 'You must select a photo to upload',
      categories:
        values.categories.size === 0
          ? 'Photo must have at least 1 category'
          : null,
    }),
  });
  const theme = useMantineTheme();
  const params = useParams();

  const [posting, setPosting] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const onFormSubmit = (values: PhotoForm) => {
    setPosting(true);
    setError(false);
    setSuccess(false);

    axios
      .post(
        import.meta.env.VITE_BASE_URL + 'api/photo',
        {
          image: values.photo,
          caption: values.caption,
          albums: JSON.stringify([params.id]),
          categories: JSON.stringify(Array.from(values.categories)),
        },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      )
      .then(() => setSuccess(true))
      .catch(() => setError(true))
      .finally(() => setPosting(false));
  };

  const onFileDrop = (files: File[]) => {
    form.setFieldValue('photo', files[0]);
  };

  const removeSelectedPhoto = (): void => {
    form.setFieldValue('photo', undefined);
  };

  const addCategory = (category: string): void => {
    const categories = new Set(form.values.categories);
    categories.add(category);
    form.setFieldValue('categories', categories);
  };

  const removeCategory = (category: string): void => {
    const categories = new Set(form.values.categories);
    categories.delete(category);
    form.setFieldValue('categories', categories);
  };

  return (
    <Container size="sm">
      <Title order={1} pb="xl">
        Photo upload
      </Title>

      <form onSubmit={form.onSubmit(onFormSubmit)}>
        <Stack>
          <div>
            <Dropzone
              accept={IMAGE_MIME_TYPE}
              multiple={false}
              onDrop={onFileDrop}
              disabled={form.values.photo ? true : false}
              {...form.getInputProps('photo')}>
              {status =>
                dropzoneChildren(
                  status,
                  theme,
                  removeSelectedPhoto,
                  form.values.photo
                )
              }
            </Dropzone>

            {form.errors.photo && (
              <Text size="sm" color="red">
                {form.errors.photo}
              </Text>
            )}
          </div>

          <TextInput
            label="Caption"
            placeholder="Photo caption..."
            required
            {...form.getInputProps('caption')}></TextInput>

          <CategorySelection
            {...{
              addCategory,
              removeCategory,
              categories: form.values.categories,
              error: form.errors.categories,
            }}></CategorySelection>

          <Group position="right">
            <Button type="submit" loading={posting}>
              Upload
            </Button>
          </Group>
        </Stack>
      </form>

      {success && (
        <Alert
          icon={<AlertCircle size={16} />}
          title="Success"
          color="green"
          mt="md">
          Photo uploaded successfully!
        </Alert>
      )}
      {error && (
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

export default UploadPhoto;
