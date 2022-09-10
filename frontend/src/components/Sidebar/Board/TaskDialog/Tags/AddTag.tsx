import {
  Button,
  ButtonBase,
  IconButton,
  Stack,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import { BoardTaskTag } from '@Src/types/pmtools/board';
import React, { useCallback, useState } from 'react';
import ArrowBack from '@mui/icons-material/ArrowBack';

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
    height: 30,
    width: 30,
    borderRadius: 4,
    transform: selected ? `scale(1.1)` : 'scale(1)',
  }),
);

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
          <IconButton onClick={onBack}>
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
          />
        ))}
      </Stack>

      <Stack direction="row" spacing={1} justifyContent="flex-end">
        <Button onClick={onClose}>Cancel</Button>
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
