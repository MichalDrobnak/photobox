import { createStyles } from '@mantine/core';

export default createStyles(theme => ({
  appFooter: {
    color: 'white',
    position: 'relative',
    marginLeft: 0,
    height: '20rem',

    [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
      height: '15rem',
    },
  },

  wave: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },

  wavePath: { stroke: 'none', fill: theme.colors.indigo[6] },
}));
