import {
  Box,
  Button as MuiButton,
  Checkbox,
  List,
  ListItem,
  ListItemButton as MuiListItemButton,
  ListItemIcon as MuiListItemIcon,
  ListItemText as MuiListItemText,
  TextField,
  styled,
} from '@mui/material';
import React, { useCallback, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { useSelector } from 'react-redux';
import { selectLabels } from '@Redux/pmtools/board/selectors';
import { BoardLabel } from '@Redux/pmtools/types';
import AddTag from './AddTag';

const SearchWrapper = styled('div')({
  padding: '8px 15px',
  maxHeight: '305px',
  overflowY: 'scroll',
  margin: '5px',

  '&::-webkit-scrollbar': {
    width: 4,
    background: '#F3F4F6',
  },

  '&::-webkit-scrollbar-thumb': {
    background: '#B0B0BD',
    borderRadius: 4,
  },

  '&::-webkit-scrollbar-track': {
    borderRadius: 4,
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

const ListItemText = styled(MuiListItemText)<{ color: string }>(
  ({ color }) => ({
    borderRadius: 16,
    padding: '4px 8px',
    display: 'inline-block',
    flex: 'none',
    background: color,

    '& span': {
      fontSize: 12,
      color: 'white',
    },
  }),
);

interface Props {
  selected: BoardLabel[];
  onChange(labels: BoardLabel[]): void;
  onClose(): void;
}

const AllTags = ({ selected, onChange, onClose }: Props) => {
  const labels = useSelector(selectLabels);

  const [showAddLabel, setShowAddLabel] = useState(labels.length < 1);

  const handleHideAddTags = useCallback(() => {
    setShowAddLabel(false);
  }, [setShowAddLabel]);

  const handleToggle = useCallback(
    (label: BoardLabel) => {
      return () => {
        const currentIndex = selected.indexOf(label);
        const newSelected = [...selected];

        if (currentIndex === -1) {
          newSelected.push(label);
        } else {
          newSelected.splice(currentIndex, 1);
        }
        onChange(newSelected);
      };
    },
    [selected, onChange],
  );

  if (showAddLabel) {
    return (
      <Box style={{ padding: '20px' }}>
        <AddTag onClose={onClose} onBack={handleHideAddTags} />
      </Box>
    );
  }

  return (
    <SearchWrapper>
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
        <Button fullWidth onClick={() => setShowAddLabel(true)}>
          New Tag
        </Button>
      </Box>

      <List
        dense
        sx={{ width: '100%', bgcolor: 'background.paper', maxHeight: 400 }}
      >
        {labels.map((label) => {
          const labelId = `checkbox-list-label-${label.text}`;

          return (
            <ListItem key={label.text} disablePadding disableGutters>
              <ListItemButton
                role={undefined}
                dense
                onClick={handleToggle(label)}
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={selected.indexOf(label) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>
                <ListItemText
                  color={label.colour}
                  id={labelId}
                  primary={label.text}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </SearchWrapper>
  );
};

export default AllTags;
