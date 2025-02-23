import {
  Alert,
  Button,
  Container,
  Group,
  Select,
  SelectItem,
  Skeleton,
  Stack,
  Title,
  Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { FunctionComponent, useState } from 'react';
import UserSelection from '../../components/UserSelection/UserSelection';
import { User } from '../../models/user';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AlertCircle } from 'tabler-icons-react';
import { usePermissions } from '../../swr/use-permissions';
import { Permission } from '../../models/permission';
import UserPermission from '../../components/UserPermission/UserPermission';

export interface ManagePermissionsProps {}

interface PermissionForm {
  user: User | null;
  permission: Permission | null;
}

const PERMISSION_OPTS: SelectItem[] = [
  { value: Permission.READ.toString(), label: 'Read' },
  { value: Permission.READ_WRITE.toString(), label: 'Read/Write' },
];

const ManagePermissions: FunctionComponent<ManagePermissionsProps> = () => {
  const params = useParams();

  const form = useForm<PermissionForm>({
    initialValues: { user: null, permission: Permission.READ },
    validate: {
      user: value => (value ? null : 'Field is required'),
      permission: value => (value ? null : 'Field is required'),
    },
  });

  const {
    data: permissionsData,
    isLoading: permissionsIsLoading,
    isError: permissionsIsError,
    mutate: mutatePermissions,
  } = usePermissions(Number(params.id));
  const permissions = permissionsData?.results;

  const [postingPermission, setPostingPermission] = useState(false);
  const [postingPermissionSuccess, setPostingPermissionSuccess] = useState<
    boolean | null
  >(null);

  const addPermission = (formValue: PermissionForm): void => {
    setPostingPermission(true);

    axios
      .post(
        import.meta.env.VITE_BASE_URL + 'api/albumuser',
        {
          liked: false,
          permissions: formValue.permission,
          album: Number(params.id),
          user: formValue.user?.id,
        },
        { withCredentials: true }
      )
      .then(() => {
        setPostingPermissionSuccess(true);
        mutatePermissions();
      })
      .catch(() => setPostingPermissionSuccess(false))
      .finally(() => setPostingPermission(false));
  };

  const deletePermission = (id: number): void => {
    axios
      .delete(import.meta.env.VITE_BASE_URL + `api/albumuser/${id}`, {
        withCredentials: true,
      })
      .then(() => mutatePermissions());
  };

  return (
    <Container size="sm">
      <Title order={1} mb="xl">
        Permission management
      </Title>

      <form onSubmit={form.onSubmit(addPermission)}>
        <Title order={2} mb="md">
          Add user permission
        </Title>

        <Stack>
          <UserSelection
            user={form.values.user}
            error={form.errors.user}
            setUser={value =>
              form.setFieldValue('user', value)
            }></UserSelection>

          <Select
            label="Permissions"
            placeholder="Select permissions..."
            data={PERMISSION_OPTS}
            required={true}
            error={form.errors.permission}></Select>

          <Group position="right">
            <Button type="submit" loading={postingPermission}>
              Add
            </Button>
          </Group>

          {postingPermissionSuccess == true ? (
            <Alert
              icon={<AlertCircle size={16} />}
              title="Success"
              color="green">
              Permission added
            </Alert>
          ) : null}
          {postingPermissionSuccess == false ? (
            <Alert icon={<AlertCircle size={16} />} title="Error" color="red">
              Something went wrong!
            </Alert>
          ) : null}
        </Stack>
      </form>

      <Title order={2} my="md">
        User permissions
      </Title>
      <Stack>
        {permissionsIsLoading && (
          <>
            <Skeleton height="4rem"></Skeleton>
            <Skeleton height="4rem"></Skeleton>
            <Skeleton height="4rem"></Skeleton>
          </>
        )}
        {permissionsIsError && (
          <Alert icon={<AlertCircle size={16} />} title="Error" color="red">
            Something went wrong!
          </Alert>
        )}
        {permissions &&
          permissions.map(permission => (
            <UserPermission
              userId={permission.user}
              permission={permission.permissions}
              key={permission.id}
              deletePermission={() =>
                deletePermission(permission.id)
              }></UserPermission>
          ))}

        {permissions && permissions.length === 0 && (
          <Text color="gray">No permissions found</Text>
        )}
      </Stack>
    </Container>
  );
};

export default ManagePermissions;
