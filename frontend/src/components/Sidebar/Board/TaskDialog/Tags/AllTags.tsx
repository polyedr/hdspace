import {
  Box,
  Button as MuiButton,
  Checkbox,
  Container as MuiContainer,
  List,
  ListItem,
  ListItemButton as MuiListItemButton,
  ListItemIcon as MuiListItemIcon,
  ListItemText as MuiListItemText,
  TextField,
  styled,
} from '@mui/material';
import { BoardTaskTag } from '@Src/types/pmtools/board';
import React, { useCallback, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import AddTag from './AddTag';

const Container = styled(MuiContainer)({
  padding: 15,
  maxHeight: '300px',
  overflowY: 'scroll',

  '&::-webkit-scrollbar': {
    width: 6,
  },
});

const FormWrapper = styled('div')({
  position: 'relative',

  '& svg': {
    position: 'absolute',
    top: '50%',
    left: 0,
    transform: 'translateY(-50%)',
    fontSize: 20,
    color: '#81818E',
  },

  '& .MuiFormControl-root': {
    margin: 0,
  },

  '& input': {
    paddingLeft: 30,
  },
});

const Button = styled(MuiButton)({
  backgroundColor: '#F3F4F6',
  color: '#81818E',
  margin: '20px 0 0',
  textTransform: 'capitalize',
});

const ListItemIcon = styled(MuiListItemIcon)({
  padding: 0,
  minWidth: 'auto',
});

const ListItemButton = styled(MuiListItemButton)({
  padding: 0,

  '&:hover': {
    backgroundColor: 'transparent',
  },
});

const ListItemText = styled(MuiListItemText)({
  borderRadius: 16,
  padding: '4px 8px',
  display: 'inline-block',
  flex: 'none',
  background: 'red',

  '& span': {
    fontSize: 12,
    color: 'white',
  },
});

interface Props {
  selected: BoardTaskTag[];
  onChange(tags: BoardTaskTag[]): void;
  onClose(): void;
}

const AllTags = ({ selected, onChange, onClose }: Props) => {
  const [tags, setTags] = useState<BoardTaskTag[]>([
    {
      text: 'Development',
      color: '#F3F4F6',
    },
    {
      text: 'Software',
      color: '#F3F4F6',
    },
    {
      text: 'Frontend',
      color: '#F3F4F6',
    },
    {
      text: 'Bug',
      color: '#F3F4F6',
    },
    {
      text: 'Improvement',
      color: '#F3F4F6',
    },
  ]);

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
      <Box style={{ padding: '20px' }}>
        <AddTag
          onClose={onClose}
          onBack={tags.length ? handleHideAddTags : undefined}
          onSubmit={handleAddTag}
        />
      </Box>
    );
  }

  return (
    <Container>
      <Box>
        <FormWrapper>
          <SearchIcon />
          <TextField
            fullWidth
            variant="standard"
            placeholder="Search"
            margin="normal"
          />
        </FormWrapper>
        <Button fullWidth onClick={() => setShowAddTag(true)}>
          New Tag
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
    </Container>
  );
};

export default AllTags;
