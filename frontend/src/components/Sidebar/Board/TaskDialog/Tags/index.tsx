import React, { useCallback, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import {
  Chip as MuiChip,
  Stack,
  Box,
  Popover as MuiPopover,
  styled,
} from '@mui/material';
import { BoardTaskTag } from '@Src/types/pmtools/board';
import { IconButton } from '../StyledComponents';
import AddTag from './AddTag';
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

const Tags = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedTags, setSelectedTags] = useState<BoardTaskTag[]>([]);

  // const handleDelete = useCallback(
  //   (index: number) => {
  //     setTags((tags) => {
  //       const newTags = [...tags];
  //       newTags.splice(index, 1);

  //       return newTags;
  //     });
  //   },
  //   [setTags],
  // );

  const handleShowTagPicker = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(e.currentTarget);
    },
    [],
  );

  const handleCloseTagPicker = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const open = Boolean(anchorEl);
  const id = open ? 'task-tags-picker' : undefined;

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {selectedTags.length > 0 ? (
        selectedTags.map((tag, index) => (
          <Chip
            // onDelete={() => handleDelete(index)}
            key={tag.text}
            label={tag.text}
            style={{ backgroundColor: tag.color, color: 'white' }}
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
          selected={selectedTags}
          onChange={setSelectedTags}
        />
      </Popover>
    </Stack>
  );
};

export default Tags;
