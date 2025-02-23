import { Button, Group, Stack, Switch, TextInput } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { FunctionComponent } from 'react';
import { User } from '../../models/user';
import UserSelection from '../UserSelection/UserSelection';

export interface AlbumCategoryFilter {
  user: User | null;
  category: string;
  public: boolean;
}

interface CategoryFilterProps {
  // eslint-disable-next-line no-unused-vars
  applyFilter: (filter: AlbumCategoryFilter) => void;
}

const CategoryFilter: FunctionComponent<CategoryFilterProps> = ({
  applyFilter,
}) => {
  const form = useForm<AlbumCategoryFilter>({
    initialValues: {
      user: null,
      category: '',
      public: false,
    },
  });

  return (
    <form onSubmit={form.onSubmit(applyFilter)}>
      <Stack>
        <UserSelection
          user={form.values.user}
          setUser={value => form.setFieldValue('user', value)}></UserSelection>
        <TextInput
          label="Category"
          placeholder="Category name..."
          {...form.getInputProps('category')}></TextInput>
        <Group position="apart">
          <Switch
            radius="xs"
            label="Public only"
            {...form.getInputProps('public')}
          />
          <Button type="submit">Apply</Button>
        </Group>
      </Stack>
    </form>
  );
};

export default CategoryFilter;
