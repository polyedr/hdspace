import {
  Box,
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
} from '@mui/material';
import { BoardTaskTag } from '@Src/types/pmtools/board';
import React, { useCallback, useState } from 'react';
import AddTag from './AddTag';

interface Props {
  selected: BoardTaskTag[];
  onChange(tags: BoardTaskTag[]): void;
  onClose(): void;
}

const AllTags = ({ selected, onChange, onClose }: Props) => {
  const [tags, setTags] = useState<BoardTaskTag[]>([]);

  const [showAddTag, setShowAddTag] = useState(tags.length < 1);

  const handleHideAddTags = useCallback(() => {
    setShowAddTag(false);
  }, [setShowAddTag]);

  const handleToggle = useCallback(
    (tag: BoardTaskTag) => {
      return () => {
        const currentIndex = selected.indexOf(tag);
        const newSelected = [...selected];

        if (currentIndex === -1) {
          newSelected.push(tag);
        } else {
          newSelected.splice(currentIndex, 1);
        }
        onChange(newSelected);
      };
    },
    [selected, onChange],
  );

  const handleAddTag = useCallback(
    (tag) => {
      const newTags = [...tags];
      newTags.push(tag);

      setTags(newTags);
      onChange([...selected, tag]);
    },
    [setTags, tags],
  );

  if (showAddTag) {
    return (
      <Box style={{ padding: '20px 30px' }}>
        <AddTag
          onClose={onClose}
          onBack={tags.length ? handleHideAddTags : undefined}
          onSubmit={handleAddTag}
        />
      </Box>
    );
  }

  return (
    <>
      <Box style={{ padding: '20px 16px 5px' }}>
        <TextField
          fullWidth
          variant="standard"
          placeholder="Search"
          margin="normal"
        />
        <Button fullWidth onClick={() => setShowAddTag(true)}>
          Add Tag
        </Button>
      </Box>

      <List
        dense
        sx={{ width: '100%', bgcolor: 'background.paper', maxHeight: 400 }}
      >
        {tags.map((tag) => {
          const labelId = `checkbox-list-label-${tag.text}`;

          return (
            <ListItem key={tag.text} disablePadding disableGutters>
              <ListItemButton
                role={undefined}
                dense
                onClick={handleToggle(tag)}
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={selected.indexOf(tag) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={tag.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </>
  );
};

export default AllTags;
