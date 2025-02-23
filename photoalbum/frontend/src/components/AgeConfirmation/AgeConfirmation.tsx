import { Center, Title, Text, Stack, Button } from '@mantine/core';
import { FunctionComponent, ReactNode, useState } from 'react';

const AGE_CONFIRMATION_KEY = 'ageConfirmed';

const AgeConfirmation: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  const [ageConfirmed, setAgeConfirmed] = useState(
    window.localStorage.getItem(AGE_CONFIRMATION_KEY) ? true : false
  );

  const confirmAge = (): void => {
    window.localStorage.setItem(AGE_CONFIRMATION_KEY, 'true');
    setAgeConfirmed(true);
  };

  const ageConfirmation = (
    <Stack justify="center" sx={{ height: '100vh' }}>
      <Center>
        <Stack align="center">
          <Title order={1} align="center">
            Are you over 18 years old?
          </Title>
          <Text align="center">
            You need to be over 18 years old to view content of this page,
            please provide you confirmation by clicking the button below.
          </Text>
          <Button onClick={confirmAge}>I confirm I am over 18 years old</Button>
        </Stack>
      </Center>
    </Stack>
  );

  return <>{ageConfirmed ? children : ageConfirmation}</>;
};

export default AgeConfirmation;
