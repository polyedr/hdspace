import React from 'react';
import { Box, BoxProps, Link } from '@material-ui/core';

import logo from '../../../assets/images/logo.png';

const Logo = ({ width, height, ...other }: BoxProps) => {
  return (
    <Link href="/">
      <Box
        sx={{
          width: width || 30,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          ...other,
        }}
      >
        <img src={logo} alt="logo" width="100%" />
      </Box>
    </Link>
  );
};

export default Logo;
