import React from 'react';
import { Box, Typography } from '@mui/material';

/** Stream Chat UI is disabled in the first cutover. */
const ChatTab: React.FC = () => (
  <Box p={2}>
    <Typography variant="body2" color="text.secondary">
      Chat is temporarily disabled.
    </Typography>
  </Box>
);

export default ChatTab;
