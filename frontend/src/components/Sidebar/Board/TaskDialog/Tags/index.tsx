import React, { useCallback, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Chip, Stack, Box, Popover } from '@mui/material';
import { BoardTaskTag } from '@Src/types/pmtools/board';
import { IconButton } from '../StyledComponents';
import AddTag from './AddTag';
import AllTags from './AllTags';

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
        <span>Add Tag</span>
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
