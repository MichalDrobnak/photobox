import {
  ActionIcon,
  Badge,
  Group,
  Text,
  Autocomplete,
  AutocompleteItem,
} from '@mantine/core';
import axios from 'axios';
import { FunctionComponent, KeyboardEvent, ReactNode, useState } from 'react';
import { X } from 'tabler-icons-react';
import { Category } from '../../models/category';

interface CategorySelectionProps {
  categories: Set<string>;
  error: ReactNode;
  // eslint-disable-next-line no-unused-vars
  addCategory: (category: string) => void;
  // eslint-disable-next-line no-unused-vars
  removeCategory: (category: string) => void;
}

/**
 * Button used inside badge for removing category.
 */
const RemoveCategoryButton: FunctionComponent<{
  removeCategory: () => void;
}> = ({ removeCategory }) => (
  <ActionIcon
    size="xs"
    color="primary"
    radius="xl"
    variant="transparent"
    onClick={() => removeCategory()}>
    <X></X>
  </ActionIcon>
);

const CategorySelection: FunctionComponent<CategorySelectionProps> = ({
  addCategory,
  removeCategory,
  categories,
  error,
}) => {
  const [autofillCategories, setAutofillCategories] = useState<string[]>([]);
  const [value, setValue] = useState('');

  const onCategoryInputKeyDown = (
    evt: KeyboardEvent<HTMLInputElement>
  ): void => {
    if (evt.key === 'Enter') {
      evt.preventDefault();

      if (value && autofillCategories.length === 0) {
        addCategory(value);
        setValue('');
      }
    } else {
      if (value.length > 2) {
        fetchCategories(value);
      } else {
        setAutofillCategories([]);
      }
    }
  };

  const onCategorySubmit = (item: AutocompleteItem): void => {
    addCategory(item.value);
    setValue('');
  };

  const fetchCategories = (nameSubstring: string): void => {
    axios
      .get(
        import.meta.env.VITE_BASE_URL +
          `api/categories?filter{slug.icontains}=${nameSubstring}`,
        { withCredentials: true }
      )
      .then(res => {
        const results: Category[] = res.data.results;
        const categoryNames = results.map(category => category.name);
        setAutofillCategories(categoryNames);
      })
      .catch(() => setAutofillCategories([]));
  };

  return (
    <div>
      <Autocomplete
        value={value}
        onChange={setValue}
        onItemSubmit={onCategorySubmit}
        data={autofillCategories}
        label="Add category"
        placeholder="Category name..."
        description="Press ENTER to add category"
        onKeyDown={onCategoryInputKeyDown}></Autocomplete>

      {error && (
        <Text size="sm" color="red">
          {error}
        </Text>
      )}

      <Group mt="sm">
        {Array.from(categories).map(category => (
          <Badge
            key={category}
            rightSection={
              <RemoveCategoryButton
                removeCategory={() =>
                  removeCategory(category)
                }></RemoveCategoryButton>
            }>
            {category}
          </Badge>
        ))}
      </Group>
    </div>
  );
};

export default CategorySelection;
