import { Stack, Box, TextField } from '@mui/material';
import React, { useCallback } from 'react';
import { Entity, LibraryElement, PropertiesChangeProps } from '@Src/types';
import {
  FlexGrowIcon,
  FlexShrinkIcon,
  FlexBasicIcon,
  AlignSelfIcon,
} from './icons';
import { InputWithIcon, IconWithButton } from '../../styledComponents';

type Props = PropertiesChangeProps<LibraryElement<Entity>> & {
  flexGrow: React.CSSProperties['flexGrow'];
  flexShrink: React.CSSProperties['flexShrink'];
  flexBasis: React.CSSProperties['flexBasis'];
}; 

const ConstrainsChild: React.FC<Props> = () => {
  const handleChangeFlex = useCallback(() => {

  }, []);

  return ( 
    <>
      <Stack
        flexDirection="row"
        marginBottom={1}
        justifyContent="space-between"  
      >
        <Stack flexDirection="row">
          <Box>
            <IconWithButton>
              <FlexShrinkIcon />
            </IconWithButton>
          </Box>
          <Box sx={{ margin: '0 4px' }}>
            <IconWithButton>
              <FlexGrowIcon />
            </IconWithButton>
          </Box>
          <Box>
            <IconWithButton>
              <FlexBasicIcon />
            </IconWithButton>
          </Box>
        </Stack>
        <Stack>
          <Box>
            <IconWithButton>
              <AlignSelfIcon />
            </IconWithButton>
          </Box>
        </Stack>
      </Stack>
      <Stack flexDirection="row">
        <InputWithIcon>
          <FlexGrowIcon />
          <TextField placeholder="0" />
        </InputWithIcon>
        <InputWithIcon sx={{ margin: '0 4px' }}>
          <FlexShrinkIcon />
          <TextField placeholder="0" />
        </InputWithIcon>
        <InputWithIcon>
          <FlexBasicIcon />
          <TextField value="Auto" disabled />
        </InputWithIcon>
      </Stack>
    </>
  );
};

export default ConstrainsChild;
