import React from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import { Box, BoxProps, Link } from '@material-ui/core';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import logo from '../../../assets/images/logo.png';

const Logo = ({ width, height, ...rest }: BoxProps) => {
  const currentScreenId = useSelector(selectCurrentScreenId);
  return (
    <Link href="/">
      <Box
        sx={{
          width: width || 32,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          ...rest,
        }}
      >
        {currentScreenId !== -1 ? (
          <ArrowBackIcon sx={{ width: '16px' }} />
        ) : (
          <img src={logo} alt="logo" width="100%" />
        )}
      </Box>
    </Link>
  );
};

export default Logo;
