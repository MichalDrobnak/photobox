import { Text, Box, Image } from '@mantine/core';
import { FunctionComponent } from 'react';
import useStyles from './AppFooter.styles';
import Logo from '../../public/img/logo-white.svg';

const AppFooter: FunctionComponent<{}> = () => {
  const { classes } = useStyles();

  return (
    <footer className={classes.appFooter}>
      <Box p={'md'} sx={{ zIndex: 1, position: 'absolute', bottom: 0 }}>
        <Image src={Logo} width={180} height={80} fit="cover"></Image>
        <Text size="md">
          Collective photo sharing platform based around authentic experiences.
          Our aim is to bring people together and to provide excellent services.
        </Text>
        <Text size="lg">@2022</Text>
      </Box>

      <svg
        viewBox="0 0 500 150"
        preserveAspectRatio="none"
        className={classes.wave}>
        <path
          d="M0.00,49.98 C198.36,10.38 332.10,68.59 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"
          className={classes.wavePath}></path>
      </svg>
    </footer>
  );
};

export default AppFooter;
