import { Button, Container, Group, Stack, Title } from '@mantine/core';
import { Link } from 'react-router-dom';
import CategoryFilter, {
  AlbumCategoryFilter,
} from '../../components/CategoryFilter/CategoryFilter';
import Albums from '../../components/Albums/Albums';
import { useState } from 'react';

function Home() {
  const [categoryFilter, setCategoryFilter] =
    useState<AlbumCategoryFilter | null>(null);

  return (
    <Container size="sm">
      <Stack>
        <Title order={1}>Albums accessible to me</Title>
        <Title order={2} mt="xl" mb="sm">
          Filter
        </Title>
        <CategoryFilter applyFilter={filter => setCategoryFilter(filter)} />
        <Group pb="xl" mt="xl" position="apart">
          <Title order={1}>Album</Title>
          <Button component={Link} to="albums/create" compact>
            Create album
          </Button>
        </Group>

        <Albums filter={categoryFilter} />
      </Stack>
    </Container>
  );
}

export default Home;
