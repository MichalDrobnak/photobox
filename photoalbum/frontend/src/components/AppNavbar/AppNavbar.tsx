import { Navbar } from '@mantine/core';
import { FunctionComponent } from 'react';
import { useAuth } from '../../auth';
import AppNavbarLinks from '../AppNavbarLinks/AppNavbarLinks';
import User from '../User/User';

export const NAVBAR_SM_WIDTH = 200;
export const NAVBAR_LG_WIDTH = 300;

interface AppNavbarProps {
  opened: boolean;
}

const AppNavbar: FunctionComponent<AppNavbarProps> = ({ opened }) => {
  const { user } = useAuth();
  return (
    <Navbar
      p="md"
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ sm: NAVBAR_SM_WIDTH, lg: NAVBAR_LG_WIDTH }}>
      <Navbar.Section grow>
        <AppNavbarLinks></AppNavbarLinks>
      </Navbar.Section>
      {user !== null && (
        <Navbar.Section>
          <User></User>
        </Navbar.Section>
      )}
    </Navbar>
  );
};

export default AppNavbar;
