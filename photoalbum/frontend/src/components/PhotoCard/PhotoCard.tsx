import {
  ActionIcon,
  Button,
  Card,
  Group,
  Image,
  Modal,
  Text,
  useMantineTheme,
  Anchor,
  Skeleton,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { FunctionComponent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings, Heart, Trash } from 'tabler-icons-react';
import { Photo } from '../../models/photo';
import { useUser } from '../../swr/use-user';

interface PhotoCardProps {
  photo: Photo;
  onLikeClick: () => void;
  onDeleteClick: () => void;
}

const PhotoCard: FunctionComponent<PhotoCardProps> = ({
  photo,
  onLikeClick,
  onDeleteClick,
}) => {
  const [opened, setOpened] = useState(false);
  const { data: userData, isLoading: isUserLoading } = useUser(photo.owner);
  const isBigScreen = useMediaQuery('(min-width: 900px)');
  const user = userData?.results;
  const theme = useMantineTheme();

  const viewPhoto = () => {
    setOpened(true);
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        size={isBigScreen ? '50%' : '99%'}>
        <Image src={photo.image} alt="Photo" width="100%"></Image>
      </Modal>

      <Card p="md" sx={theme => ({ background: theme.colors.gray[1] })}>
        {/* Image */}
        <Card.Section>
          <Image src={photo.image} height={200} alt="Photo"></Image>
        </Card.Section>

        <Group position="apart" pt="md">
          {/* Author */}
          {isUserLoading && <Skeleton height="1ch"></Skeleton>}
          {user && (
            <Text size="md" weight="bold">
              {user.full_name}
            </Text>
          )}

          {/* Action buttons */}
          <Group>
            <Anchor component={Link} to={`/photo/${photo.id}/edit`}>
              <ActionIcon>
                <Settings></Settings>
              </ActionIcon>
            </Anchor>
            {onLikeClick && (
              <ActionIcon onClick={onLikeClick}>
                <Heart
                  fill={photo.liked ? theme.colors.red[7] : 'none'}
                  stroke={photo.liked ? theme.colors.red[7] : 'currentColor'}
                />
              </ActionIcon>
            )}
            {onDeleteClick && (
              <ActionIcon onClick={onDeleteClick}>
                <Trash></Trash>
              </ActionIcon>
            )}
          </Group>
        </Group>

        {/* Caption */}
        <Text size="sm">{photo.caption}</Text>

        <Button mt="sm" onClick={viewPhoto}>
          View
        </Button>
      </Card>
    </>
  );
};

export default PhotoCard;
