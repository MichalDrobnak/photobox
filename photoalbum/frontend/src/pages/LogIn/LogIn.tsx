import {
  PasswordInput,
  TextInput,
  Button,
  Group,
  Container,
  Stack,
  Title,
  Alert,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'tabler-icons-react';
import { LoginCredentials, useAuth } from '../../auth';

function LogIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If user has been navigated to login page from another page which required authentication
  // this value will represent the location of that page, else it will point to home page.
  const locationAfterLogin =
    (location.state as { from: Location })?.from?.pathname || '/';

  const form = useForm<LoginCredentials>({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: value => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: value =>
        value.length < 5 ? 'Password must have at least 5 letters' : null,
    },
  });

  const onLogin = (credentials: LoginCredentials): void => {
    setLoading(true);
    setError(null);

    login(
      credentials,
      () => {
        setLoading(false);
        // { Replace: true } makes sure that login page won't create another entry
        // in the history stack. This means that when they get to the protected page
        // and click the back button, they won't end up back on the login page.
        navigate(locationAfterLogin, { replace: true });
      },
      () => {
        setLoading(false);
        setError('An error occured');
      }
    );
  };

  return (
    <Container size="sm">
      <Title order={1} pb="xl">
        Log In
      </Title>
      <form onSubmit={form.onSubmit(onLogin)}>
        <Stack>
          <TextInput
            required
            label="Email"
            placeholder="your@email.com"
            {...form.getInputProps('email')}
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Password"
            {...form.getInputProps('password')}
          />

          <Group position="right">
            <Button type="submit" loading={loading}>
              Log In
            </Button>
          </Group>

          {error !== null && (
            <Alert icon={<AlertCircle size={16} />} title="Error" color="red">
              {error}
            </Alert>
          )}
        </Stack>
      </form>
    </Container>
  );
}

export default LogIn;
