import { Burger, Header, MediaQuery, Image } from '@mantine/core';
import { FunctionComponent } from 'react';
import Logo from '../../public/img/logo.svg';

export const HEADER_SIZE = 70;

interface AppHeaderProps {
  opened: boolean;
  toggleNavbar: () => void;
}

const AppHeader: FunctionComponent<AppHeaderProps> = ({
  opened,
  toggleNavbar,
}) => {
  const title = opened ? 'Close navigation' : 'Open navigation';

  return (
    <Header height={HEADER_SIZE} p="md">
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
          <Burger
            opened={opened}
            onClick={() => toggleNavbar()}
            size="sm"
            mr="xl"
            title={title}
          />
        </MediaQuery>

        <Image src={Logo} height={40}></Image>
      </div>
    </Header>
  );
};

export default AppHeader;
