import React from 'react';
import LinearProgress, {
  LinearProgressProps,
} from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { styled } from '@mui/material';

const StyledLinearProgress = styled(LinearProgress)({
  height: 6,
  borderRadius: 10,
  backgroundColor: '#E4E6EB',

  '& .MuiLinearProgress-bar': {
    backgroundColor: '#1CC09F',
  },
});

const ProgressBar = ({ progress }: { progress: number }) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <StyledLinearProgress variant="determinate" value={progress} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">
            {`${Math.round(progress)}%`}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(ProgressBar);
