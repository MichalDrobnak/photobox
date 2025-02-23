import { NavbarLinkProps } from '../NavbarLink/NavbarLink';
import { Home, Folder, Login, Registered } from 'tabler-icons-react';

const data: NavbarLinkProps[] = [
  {
    icon: <Home size={16} />,
    color: 'blue',
    label: 'Home',
    to: '/',
    authenticated: true,
  },
  {
    icon: <Folder size={16} />,
    color: 'violet',
    label: 'Create album',
    to: 'albums/create',
    authenticated: true,
  },
  {
    icon: <Login size={16} />,
    color: 'grey',
    label: 'Login',
    to: '/login',
    authenticated: false,
  },
  {
    icon: <Registered size={16} />,
    color: 'red',
    label: 'Register',
    to: '/register',
    authenticated: false,
  },
];

export default data;
