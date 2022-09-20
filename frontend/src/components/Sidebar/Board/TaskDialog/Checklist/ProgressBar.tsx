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

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number },
) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <StyledLinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

const ProgressBar = () => {
  const [progress, setProgress] = React.useState(10);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 10 : prevProgress + 10,
      );
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgressWithLabel value={progress} />
    </Box>
  );
};

// const ProgressBar = () => {
//     return (
//         <>
//         <Box sx={{ width: '100%' }}>
//       <LinearProgressWithLabel variant="determinate" value={progress} />
//     </Box>
//                 <LinearProgress
//                   variant="determinate"
//                   value={30}
//                   color="inherit"
//                 />
//         </>
//     );
// };

export default React.memo(ProgressBar);
