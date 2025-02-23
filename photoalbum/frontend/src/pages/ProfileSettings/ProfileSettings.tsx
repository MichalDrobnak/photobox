import {
  Alert,
  Button,
  Container,
  Group,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import axios from 'axios';
import { useState } from 'react';
import { AlertCircle } from 'tabler-icons-react';
import { useAuth } from '../../auth';
import ProfileSettingsCredentials from '../../models/profile-settings';

function ProfileSettings() {
  const [loading, setLoading] = useState(false);
  const [succes, setSucces] = useState<boolean | null>(null);
  const { user, refreshProfile } = useAuth();

  const form = useForm<ProfileSettingsCredentials>({
    initialValues: {
      username: '',
      firstname: '',
      lastname: '',
    },

    validate: {
      username: value =>
        value.length < 5 ? 'Username must have at least 5 letters' : null,
      firstname: value =>
        value.length < 3 ? 'Firstname must have at least 3 letters' : null,
      lastname: value =>
        value.length < 3 ? 'Lastname must have at least 3 letters' : null,
    },
  });

  const onSettings = async (
    credentials: ProfileSettingsCredentials
  ): Promise<void> => {
    setLoading(true);
    setSucces(null);

    const pythonCaseCredentials = {
      first_name: credentials.firstname,
      last_name: credentials.lastname,
      username: credentials.username,
    };

    axios
      .patch(
        import.meta.env.VITE_BASE_URL + 'api/users/' + user.id + '/',
        pythonCaseCredentials,
        { withCredentials: true }
      )
      .then(() => {
        refreshProfile();
        setSucces(true);
      })
      .catch(() => setSucces(false))
      .finally(() => setLoading(false));
  };

  return (
    <Container size="sm">
      <Title order={1} pb="xl">
        Profile settings
      </Title>
      <form onSubmit={form.onSubmit(onSettings)}>
        <Stack>
          <TextInput
            required
            label="Username"
            placeholder="Username"
            {...form.getInputProps('username')}
          />

          <Group grow>
            <TextInput
              required
              label="First name"
              placeholder="First name"
              {...form.getInputProps('firstname')}
            />

            <TextInput
              required
              label="Last name"
              placeholder="Last name"
              {...form.getInputProps('lastname')}
            />
          </Group>

          <Group position="right">
            <Button type="submit" loading={loading}>
              Save
            </Button>
          </Group>

          {succes == true ? (
            <Alert
              icon={<AlertCircle size={16} />}
              title="Successfully changed!"
              color="green">
              {undefined}
            </Alert>
          ) : null}
          {succes == false ? (
            <Alert icon={<AlertCircle size={16} />} title="Error" color="red">
              Something went wrong!
            </Alert>
          ) : null}
        </Stack>
      </form>
    </Container>
  );
}

export default ProfileSettings;
