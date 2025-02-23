import { FunctionComponent } from 'react';
import { Logout } from 'tabler-icons-react';
import { useAuth } from '../../auth';
import NavbarButton from '../NavbarButton/NavbarButton';
import NavbarLink from '../NavbarLink/NavbarLink';
import navbarLinks from './links';

const AppNavbarLinks: FunctionComponent<{}> = () => {
  const { user, logout } = useAuth();

  const links = navbarLinks
    .filter(link => (link.authenticated ? user !== null : user === null))
    .map(link => <NavbarLink {...link} key={link.label} />);
  return (
    <div>
      {links}
      {user !== null && (
        <NavbarButton
          label="Log out"
          color="red"
          icon={<Logout size={16}></Logout>}
          action={() => logout()}></NavbarButton>
      )}
    </div>
  );
};

export default AppNavbarLinks;
