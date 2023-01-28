import { Stack, Box, TextField } from '@mui/material';
import React, { useCallback } from 'react';
import { Entity, LibraryElement, PropertiesChangeProps } from '@Src/types';
import {
  InputWithIcon,
  IconWithButton,
} from '@Components/RightPanel/PropertiesTab/styledComponents';
import {
  FlexGrowIcon,
  FlexShrinkIcon,
  FlexBasicIcon,
  AlignSelfIcon,
} from './icons';

type Props = PropertiesChangeProps<LibraryElement<Entity>>;

const flexValues = {
  shrink: [0, 1, 'auto'],
  grow: [1, 1, 0],
  auto: [0, 0, 'auto'],
};

interface FlexProps {
  flexGrow: React.CSSProperties['flexGrow'];
  flexShrink: React.CSSProperties['flexShrink'];
  flexBasis: React.CSSProperties['flexBasis'];
}

const ConstrainsChild: React.FC<Props> = ({ element, updateStyles }) => {
  const childStyles = element.styles.ownStyles['& > *'] as FlexProps | null;

  const handleChangeFlex = useCallback(
    (values) => () => {
      updateStyles({
        '& > *': {
          ...childStyles,
          flexGrow: values[0],
          flexShrink: values[1],
          flexBasis: values[2],
        },
      });
    },
    [updateStyles, childStyles],
  );

  const handleChangeFlexProperty = useCallback(
    (property: keyof FlexProps) => (e: React.ChangeEvent<HTMLInputElement>) => {
      updateStyles({
        '& > *': {
          ...childStyles,
          [property]: e.target.value,
        },
      });
    },
    [updateStyles, childStyles],
  );

  const compareFlexProps = (values) =>
    values[0] === childStyles?.flexGrow &&
    values[1] === childStyles?.flexShrink &&
    values[2] === childStyles?.flexBasis;

  return (
    <>
      <Stack
        flexDirection="row"
        marginBottom={1}
        justifyContent="space-between"
      >
        <Stack flexDirection="row">
          <Box>
            <IconWithButton
              selected={compareFlexProps(flexValues.shrink)}
              onClick={handleChangeFlex(flexValues.shrink)}
            >
              <FlexShrinkIcon />
            </IconWithButton>
          </Box>
          <Box sx={{ margin: '0 4px' }}>
            <IconWithButton
              selected={compareFlexProps(flexValues.grow)}
              onClick={handleChangeFlex(flexValues.grow)}
            >
              <FlexGrowIcon />
            </IconWithButton>
          </Box>
          <Box>
            <IconWithButton
              selected={compareFlexProps(flexValues.auto)}
              onClick={handleChangeFlex(flexValues.auto)}
            >
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
          <TextField
            value={childStyles?.flexShrink ?? undefined}
            onChange={handleChangeFlexProperty('flexShrink')}
          />
        </InputWithIcon>
        <InputWithIcon sx={{ margin: '0 4px' }}>
          <FlexShrinkIcon />
          <TextField
            value={childStyles?.flexGrow ?? undefined}
            onChange={handleChangeFlexProperty('flexGrow')}
          />
        </InputWithIcon>
        <InputWithIcon>
          <FlexBasicIcon />
          <span>{childStyles?.flexBasis ?? 'auto'}</span>
        </InputWithIcon>
      </Stack>
    </>
  );
};

export default ConstrainsChild;
