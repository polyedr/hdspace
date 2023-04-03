import React from 'react';
import { useSelector } from 'react-redux';
import { Box, BoxProps, Link } from '@mui/material';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';

// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ExitIcon } from '../Icon';
import logo from '../../../assets/images/logo.png';

function Logo({ width, height, ...rest }: BoxProps) {
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
          <ExitIcon />
        ) : (
          <img src={logo} alt="logo" width="100%" />
        )}
      </Box>
    </Link>
  );
}

export default Logo;
