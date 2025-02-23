import { Anchor } from '@mantine/core';
import { FunctionComponent, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import NavbarButton from '../NavbarButton/NavbarButton';

export interface NavbarLinkProps {
  icon: ReactNode;
  color: string;
  label: string;
  to: string;
  authenticated: boolean;
}

const NavbarLink: FunctionComponent<NavbarLinkProps> = ({
  to,
  ...buttonProps
}) => {
  return (
    <Anchor component={Link} to={to}>
      <NavbarButton {...buttonProps}></NavbarButton>
    </Anchor>
  );
};

export default NavbarLink;
