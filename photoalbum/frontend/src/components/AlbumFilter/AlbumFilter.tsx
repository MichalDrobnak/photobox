import { Button, Group, MediaQuery, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { FunctionComponent } from 'react';
import { User } from '../../models/user';
import UserSelection from '../UserSelection/UserSelection';

export interface AlbumPhotosFilter {
  user: User | null;
  caption: string;
}

interface AlbumFilterProps {
  // eslint-disable-next-line no-unused-vars
  applyFilter: (filter: AlbumPhotosFilter) => void;
}

const AlbumFilter: FunctionComponent<AlbumFilterProps> = ({ applyFilter }) => {
  const form = useForm<AlbumPhotosFilter>({
    initialValues: {
      user: null,
      caption: '',
    },
  });

  return (
    <MediaQuery largerThan="md" styles={{ width: '50%' }}>
      <form onSubmit={form.onSubmit(applyFilter)}>
        <Stack>
          <UserSelection
            user={form.values.user}
            setUser={value =>
              form.setFieldValue('user', value)
            }></UserSelection>
          <TextInput
            label="Caption"
            placeholder="Image caption..."
            {...form.getInputProps('caption')}></TextInput>
          <Group position="right">
            <Button type="submit">Apply</Button>
          </Group>
        </Stack>
      </form>
    </MediaQuery>
  );
};

export default AlbumFilter;
