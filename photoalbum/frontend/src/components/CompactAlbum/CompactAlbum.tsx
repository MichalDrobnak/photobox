import {
  Box,
  Group,
  ThemeIcon,
  Text,
  ActionIcon,
  Badge,
  Stack,
  Anchor,
  useMantineTheme,
  Skeleton,
} from '@mantine/core';
import { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Photo, Settings, Trash } from 'tabler-icons-react';
import { useUser } from '../../swr/use-user';

interface CompactAlbumProps {
  id: number;
  name: string;
  owner: number;
  liked?: boolean;
  categories?: string[];
  showSettingsBtn?: boolean;
  onDeleteClick?: () => void;
  onLikeClick?: () => void;
}

const CompactAlbum: FunctionComponent<CompactAlbumProps> = ({
  id,
  name,
  liked,
  owner,
  categories,
  showSettingsBtn,
  onDeleteClick,
  onLikeClick,
}) => {
  const theme = useMantineTheme();
  const { data: ownerData, isLoading: ownerIsLoading } = useUser(owner);
  const ownerName = ownerData?.results.full_name;

  const categoryBadges =
    categories && categories.length > 0 ? (
      <Group>
        {categories.map(category => (
          <Badge key={category}>{category}</Badge>
        ))}
      </Group>
    ) : null;

  return (
    <Stack spacing="xs">
      <Box
        p="sm"
        sx={theme => ({
          background: theme.colors.gray[1],
          borderRadius: theme.radius.lg,
        })}>
        <Group position="apart">
          <Anchor
            component={Link}
            to={`/albums/${id}`}
            style={{ textDecoration: 'none' }}>
            <Group>
              <ThemeIcon size="xl" variant="light">
                <Photo />
              </ThemeIcon>

              <div>
                <Text size="md">{name}</Text>
                {ownerIsLoading && <Skeleton height="1ch"></Skeleton>}
                {ownerName && <Text size="sm">{ownerName}</Text>}
              </div>
            </Group>
          </Anchor>

          <Group>
            {onDeleteClick && (
              <ActionIcon onClick={onDeleteClick}>
                <Trash></Trash>
              </ActionIcon>
            )}
            {showSettingsBtn && (
              <ActionIcon component={Link} to="settings">
                <Settings></Settings>
              </ActionIcon>
            )}
            {onLikeClick && (
              <ActionIcon onClick={onLikeClick}>
                <Heart
                  fill={liked ? theme.colors.red[7] : 'none'}
                  stroke={liked ? theme.colors.red[7] : 'currentColor'}
                />
              </ActionIcon>
            )}
          </Group>
        </Group>
      </Box>
      <Group>{categoryBadges}</Group>
    </Stack>
  );
};

export default CompactAlbum;
