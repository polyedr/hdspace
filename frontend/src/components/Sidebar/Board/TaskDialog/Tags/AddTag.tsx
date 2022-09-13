import {
  Button as MuiButton,
  ButtonBase,
  IconButton,
  Stack,
  styled,
  TextField as MuiTextField,
  Typography as MuiTypography,
} from '@mui/material';
import { BoardTaskTag } from '@Src/types/pmtools/board';
import React, { useCallback, useState } from 'react';
import ArrowBack from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';

const colors = [
  '#F3F4F6',
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

const AddTag = ({
  onClose,
  onBack,
  onSubmit,
}: {
  onClose(): void;
  onBack?(): void;
  onSubmit(tag: BoardTaskTag): void;
}) => {
  const [value, setValue] = useState('');
  const [color, setColor] = useState(colors[0]);

  const handleChangeValue = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value.trim());
    },
    [setValue],
  );

  const handleChangeColor = useCallback((color) => {
    return () => setColor(color);
  }, []);

  const handleSubmit = useCallback(() => {
    onSubmit({ color, text: value });
    setColor(colors[0]);
    setValue('');
  }, [onSubmit, color, value, onBack, onClose]);

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
            selected={c === color}
          >
            {c === color ? <CheckIcon /> : null}
          </ColorSquare>
        ))}
      </Stack>

      <Stack direction="row" spacing={1} justifyContent="flex-end">
        <Button onClick={onClose} variant="text">
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
