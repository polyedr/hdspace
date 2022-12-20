import {
  Button as MuiButton,
  ButtonBase,
  IconButton,
  Stack,
  styled,
  TextField as MuiTextField,
  Typography as MuiTypography,
} from '@mui/material';
import React, { useCallback, useState } from 'react';
import ArrowBack from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import { useDispatch } from 'react-redux';
import { createProjectLabel } from '@Redux/pmtools/board/actions/labels';

const colors = [
  '#007500',
  '#EF3052',
  '#FAB200',
  '#FF9A50',
  '#2C8DA3',
  '#5064FF',
  '#7243F8',
  '#D613AB',
];

const ColorSquare = styled(ButtonBase)<{ color: string; selected: boolean }>(
  ({ color, selected }) => ({
    backgroundColor: color,
    height: 24,
    width: 24,
    borderRadius: 4,
    transform: selected ? `scale(1.1)` : 'scale(1)',

    '& svg': {
      color: '#81818E',
      fontSize: 14,
    },
  }),
);

const Typography = styled(MuiTypography)({
  fontSize: 14,
  fontWeight: 600,
});

const TextField = styled(MuiTextField)({
  marginTop: 12,
  '& input': {
    fontSize: 14,
    padding: '8px 14px',
  },
});

const Button = styled(MuiButton)({
  textTransform: 'capitalize',

  '&.MuiButton-text': {
    color: '#81818E',
  },

  '&.MuiButton-contained:not(.Mui-disabled)': {
    backgroundColor: 'var(--blue)',
  },
});

const AddTag = ({ onBack, onClose }: { onBack?(): void; onClose(): void }) => {
  const [value, setValue] = useState('');
  const [colour, seColour] = useState(colors[0]);

  const dispatch = useDispatch();

  const handleChangeValue = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    },
    [setValue],
  );

  const handleChangeColor = useCallback((color) => {
    return () => seColour(color);
  }, []);

  const handleSubmit = useCallback(() => {
    dispatch(createProjectLabel(value, colour));
    seColour(colors[0]);
    setValue('');
    if (onBack) {
      onBack();
    }
  }, [colour, value, onBack]);

  const handleCancel = useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      onClose();
    }
  }, [onClose]);

  return (
    <>
      <Stack direction="row" spacing={2} alignItems="center">
        {onBack ? (
          <IconButton onClick={onBack} sx={{ padding: 0 }}>
            <ArrowBack />
          </IconButton>
        ) : null}

        <Typography variant="h6">New Tag</Typography>
      </Stack>

      <TextField
        size="small"
        fullWidth
        placeholder="Type Tag"
        margin="normal"
        onChange={handleChangeValue}
        value={value}
      />

      <Stack
        direction="row"
        spacing={1}
        style={{ marginBottom: 20, marginTop: 10 }}
      >
        {colors.map((c) => (
          <ColorSquare
            onClick={handleChangeColor(c)}
            key={c}
            color={c}
            selected={c === colour}
          >
            {c === colour ? <CheckIcon /> : null}
          </ColorSquare>
        ))}
      </Stack>

      <Stack direction="row" spacing={1} justifyContent="flex-end">
        <Button onClick={handleCancel} variant="text">
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={value.length < 1}
          onClick={handleSubmit}
        >
          Add
        </Button>
      </Stack>
    </>
  );
};

export default AddTag;
