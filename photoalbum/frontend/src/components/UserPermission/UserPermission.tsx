import { ActionIcon, Avatar, Group, Text } from '@mantine/core';
import { FunctionComponent } from 'react';
import { X } from 'tabler-icons-react';
import { Permission } from '../../models/permission';
import { useUser } from '../../swr/use-user';

interface UserPermissionProps {
  userId: number;
  permission: Permission;
  deletePermission: () => void;
}

const UserPermission: FunctionComponent<UserPermissionProps> = ({
  userId,
  permission,
  deletePermission,
}) => {
  const { data } = useUser(userId);
  const user = data?.results;

  let permissionName = '';

  switch (permission) {
    case Permission.READ:
      permissionName = 'Read';
      break;
    case Permission.READ_WRITE:
      permissionName = 'Read/Write';
      break;
    default:
      break;
  }

  return (
    <>
      {user && (
        <Group>
          <Avatar />

          <div>
            <Text>{user.full_name}</Text>
            <Text size="xs" color="dimmed">
              {permissionName}
            </Text>
          </div>

          <ActionIcon onClick={deletePermission}>
            <X></X>
          </ActionIcon>
        </Group>
      )}
    </>
  );
};

export default UserPermission;
