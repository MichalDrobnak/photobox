import { Button, Group, Stack, Switch, TextInput } from '@mantine/core';
import { FunctionComponent } from 'react';
import { useForm } from '@mantine/form';
import CategorySelection from '../CategorySelection/CategorySelection';

export interface AlbumFormValue {
  name: string;
  isPublic: boolean;
  categories: Set<string>;
}

interface AlbumFormProps {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (formValue: AlbumFormValue) => void;
  posting?: boolean;
  editingMode?: boolean;
  defaultValue?: AlbumFormValue;
}

const AlbumForm: FunctionComponent<AlbumFormProps> = ({
  onSubmit,
  defaultValue,
  editingMode,
  posting,
}) => {
  const form = useForm<AlbumFormValue>({
    initialValues: defaultValue ?? {
      name: '',
      isPublic: false,
      categories: new Set<string>(),
    },
    validate: values => ({
      name: values.name ? null : 'Field is required',
      categories:
        values.categories.size === 0
          ? 'Album must have at least 1 category'
          : null,
    }),
  });

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
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack>
        <TextInput
          label="Name"
          placeholder="Name..."
          required
          {...form.getInputProps('name')}></TextInput>

        <CategorySelection
          {...{
            addCategory,
            removeCategory,
            categories: form.values.categories,
            error: form.errors.categories,
          }}></CategorySelection>

        <Group position="apart">
          <Switch
            label="Make public"
            radius="xs"
            {...form.getInputProps('isPublic', { type: 'checkbox' })}
          />

          <Button type="submit" loading={posting}>
            {editingMode ? 'Edit' : 'Create'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default AlbumForm;
