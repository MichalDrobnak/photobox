import { UnstyledButton, Group, ThemeIcon, Text } from '@mantine/core';
import { FunctionComponent } from 'react';
import { NavbarLinkProps } from '../NavbarLink/NavbarLink';

type NavbarButtonProps = Omit<NavbarLinkProps, 'to' | 'authenticated'> & {
  action?: () => void;
};

const NavbarButton: FunctionComponent<NavbarButtonProps> = ({
  label,
  icon,
  color,
  action,
}) => {
  return (
    <UnstyledButton
      {...(action ? { onClick: action } : {})}
      sx={theme => ({
        display: 'block',
        width: '100%',
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color:
          theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

        '&:hover': {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
        },
      })}>
      <Group>
        <ThemeIcon color={color} variant="light">
          {icon}
        </ThemeIcon>

        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  );
};

export default NavbarButton;
