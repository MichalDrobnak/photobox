import {
  Alert,
  Button,
  Container,
  Group,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { DatePicker } from '@mantine/dates';
import { useState } from 'react';
import { AlertCircle } from 'tabler-icons-react';
import axios from 'axios';
import { RegisterCredentials } from '../../auth';

function Registration() {
  const [loading, setLoading] = useState(false);
  const [succes, setSucces] = useState<boolean | null>(null);

  const form = useForm<RegisterCredentials>({
    initialValues: {
      username: '',
      email: '',
      firstname: '',
      lastname: '',
      birthdate: '',
      password: '',
    },

    validate: {
      username: (value: string | any[]) =>
        value.length < 5 ? 'Username must have at least 5 letters' : null,
      firstname: (value: string | any[]) =>
        value.length < 3 ? 'Firstname must have at least 3 letters' : null,
      lastname: (value: string | any[]) =>
        value.length < 3 ? 'Lastname must have at least 3 letters' : null,
      email: (value: string) =>
        /^\S+@\S+$/.test(value) ? null : 'Invalid email',
      password: (valuepassword: string | any[]) =>
        valuepassword.length < 5
          ? 'Password must have at least 5 letters'
          : null,
    },
  });

  const onRegister = (credentials: RegisterCredentials): void => {
    setLoading(true);
    setSucces(null);

    const pythonCaseCredentials = {
      date_of_birth: credentials.birthdate,
      first_name: credentials.firstname,
      last_name: credentials.lastname,
      username: credentials.username,
      email: credentials.email,
      password: credentials.password,
    };

    axios
      .post(
        import.meta.env.VITE_BASE_URL + 'api/auth/register/',
        pythonCaseCredentials
      )
      .then(() => setSucces(true))
      .catch(() => setSucces(false))
      .finally(() => setLoading(false));
  };

  return (
    <Container size="sm">
      <Title order={1} pb="xl">
        Register
      </Title>
      <form onSubmit={form.onSubmit(onRegister)}>
        <Stack>
          <TextInput
            required
            label="Username"
            placeholder="Username"
            {...form.getInputProps('username')}
          />
          <TextInput
            required
            label="Email"
            placeholder="your@email.com"
            {...form.getInputProps('email')}
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

          <DatePicker
            placeholder="Date of birth"
            label="Date of birth"
            required
            inputFormat="YYYY/MM/DD"
            {...form.getInputProps('birthdate')}
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Password"
            {...form.getInputProps('password')}
          />

          <Group position="right">
            <Button type="submit" loading={loading}>
              Register
            </Button>
          </Group>

          {succes == true ? (
            <Alert
              icon={<AlertCircle size={16} />}
              title="Registered!"
              color="green">
              You are succesfully registered!
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

export default Registration;
