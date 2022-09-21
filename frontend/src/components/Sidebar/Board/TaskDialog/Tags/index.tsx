import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import AddIcon from '@mui/icons-material/Add';
import {
  Chip as MuiChip,
  Stack,
  Popover as MuiPopover,
  styled,
} from '@mui/material';
import { BoardLabel, BoardTask } from '@Redux/pmtools/types';
import { useSelector } from 'react-redux';
import { selectLabels } from '@Redux/pmtools/board/selectors';
import { IconButton } from '../StyledComponents';
import AllTags from './AllTags';

const InfoTitle = styled('span')({
  color: '#81818E',
  fontSize: 14,
  fontWeight: 500,
  margin: '16px 0',
});

const Popover = styled(MuiPopover)({
  '& .MuiPaper-root': {
    boxShadow:
      '0px 0px 1px rgba(42, 42, 45, 0.16), 0px 2px 6px rgba(42, 42, 45, 0.08)',
    borderRadius: 6,
  },
});

const Chip = styled(MuiChip)({
  height: 24,
  padding: '4px 8px',
  '& span': {
    color: 'white',
    lineHeight: 1,
    fontSize: 12,
    padding: 0,
  },
});

interface Props {
  task: BoardTask;
  onChange(tags: BoardLabel[]): void;
}

const Tags = ({ task, onChange }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selected, setSelected] = useState<number[]>(task.label_ids);

  const labels = useSelector(selectLabels);

  const mountedRef = useRef(false);

  const handleShowTagPicker = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(e.currentTarget);
    },
    [],
  );

  const handleCloseTagPicker = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const selectedLabels = useMemo(() => {
    const mergedLabels = selected
      .map((id) => {
        return labels.find((l) => l.id === id) ?? null;
      })
      .filter((l) => l !== null) as BoardLabel[];

    return mergedLabels.sort((a, b) => (a.text > b.text ? 1 : -1));
  }, [selected, labels]);

  useEffect(() => {
    if (mountedRef.current) {
      onChange(selected);
    } else {
      mountedRef.current = true;
    }
  }, [selected]);

  const open = Boolean(anchorEl);
  const id = open ? 'task-tags-picker' : undefined;

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {selectedLabels.length > 0 ? (
        selectedLabels.map((label) => (
          <Chip
            key={label.id.toString()}
            label={label.text}
            style={{ backgroundColor: label.colour, color: 'white' }}
          />
        ))
      ) : (
        <InfoTitle>Add Tag</InfoTitle>
      )}

      <IconButton onClick={handleShowTagPicker}>
        <AddIcon />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleCloseTagPicker}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <AllTags
          onClose={handleCloseTagPicker}
          selected={selected}
          onChange={setSelected}
        />
      </Popover>
    </Stack>
  );
};

export default Tags;
