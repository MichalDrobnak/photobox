import {
  Box,
  UnstyledButton,
  Group,
  Avatar,
  useMantineTheme,
  Text,
  Anchor,
} from '@mantine/core';
import { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'tabler-icons-react';
import { useAuth } from '../../auth';

const User: FunctionComponent<{}> = () => {
  const theme = useMantineTheme();
  const { user } = useAuth();

  return (
    <Anchor
      component={Link}
      to="/profile"
      sx={{
        borderTop: `1px solid ${
          theme.colorScheme === 'dark'
            ? theme.colors.dark[4]
            : theme.colors.gray[2]
        }`,
      }}>
      <UnstyledButton
        sx={{
          display: 'block',
          width: '100%',
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color:
            theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

          '&:hover': {
            backgroundColor:
              theme.colorScheme === 'dark'
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
          },
        }}>
        <Group>
          <Avatar radius="xl" />
          <Box sx={{ flex: 1 }}>
            <Text size="sm" weight={500}>
              {user ? user.full_name : 'Unknown user'}
            </Text>
            {user?.email && (
              <Text color="dimmed" size="xs">
                {user.email}
              </Text>
            )}
          </Box>

          <ChevronRight size={18} />
        </Group>
      </UnstyledButton>
    </Anchor>
  );
};

export default User;
