import {
  ActionIcon,
  Autocomplete,
  Avatar,
  Group,
  SelectItemProps,
  Stack,
  Text,
} from '@mantine/core';
import axios from 'axios';
import {
  FunctionComponent,
  useState,
  KeyboardEvent,
  forwardRef,
  ReactNode,
} from 'react';
import { X } from 'tabler-icons-react';
import { User } from '../../models/user';

interface UserSelectionProps {
  user: User | null;
  // eslint-disable-next-line no-unused-vars
  setUser: (user: User | null) => void;
  error?: ReactNode;
}

interface UserItemProps extends SelectItemProps {
  username: string;
  full_name: string;
}

const UserChip: FunctionComponent<{
  username: string;
  fullName: string;
  cancelFunc?: () => void;
}> = ({ username, fullName, cancelFunc }) => {
  return (
    <Group noWrap>
      <Avatar />

      <div>
        <Text>{username}</Text>
        <Text size="xs" color="dimmed">
          {fullName}
        </Text>
      </div>

      {cancelFunc && (
        <ActionIcon onClick={cancelFunc}>
          <X></X>
        </ActionIcon>
      )}
    </Group>
  );
};

// eslint-disable-next-line react/display-name
const AutoCompleteItem = forwardRef<HTMLDivElement, UserItemProps>(
  ({ username, full_name, ...others }: UserItemProps, ref) => (
    <div ref={ref} {...others}>
      <UserChip username={username} fullName={full_name}></UserChip>
    </div>
  )
);

const UserSelection: FunctionComponent<UserSelectionProps> = ({
  user,
  setUser,
  error,
}) => {
  const [autofillUsers, setAutofillUsers] = useState<
    (User & { value: string })[]
  >([]);
  const [value, setValue] = useState('');

  const fetchUsers = (userSubstring: string): void => {
    axios
      .get(
        import.meta.env.VITE_BASE_URL +
          `api/users/?filter{username.icontains}=${userSubstring}`,
        { withCredentials: true }
      )
      .then(res => {
        const results: User[] = res.data.results;
        setAutofillUsers(
          results.map(user => ({ ...user, value: user.username }))
        );
      })
      .catch(() => setAutofillUsers([]));
  };

  const onKeyDown = (evt: KeyboardEvent<HTMLInputElement>): void => {
    if (evt.key === 'Enter') {
      evt.preventDefault();
    } else {
      if (value.length > 2) {
        fetchUsers(value);
      } else {
        setAutofillUsers([]);
      }
    }
  };

  const onUserSelection = ({
    // eslint-disable-next-line no-unused-vars
    value,
    ...user
  }: User & { value: string }): void => {
    setUser(user);
    setValue('');
  };

  const cancelSelection = (): void => {
    setUser(null);
  };

  return (
    <Stack>
      <div>
        <Autocomplete
          label="User"
          description="Press ENTER to select user"
          placeholder="Username..."
          value={value}
          onChange={setValue}
          onKeyDown={onKeyDown}
          onItemSubmit={onUserSelection}
          itemComponent={AutoCompleteItem}
          data={autofillUsers}></Autocomplete>

        {error && (
          <Text size="sm" color="red">
            {error}
          </Text>
        )}
      </div>

      {user !== null && (
        <UserChip
          username={user.username}
          fullName={user.full_name}
          cancelFunc={cancelSelection}></UserChip>
      )}
    </Stack>
  );
};

export default UserSelection;
