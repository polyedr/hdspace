import {
  Box,
  Button as MuiButton,
  List,
  TextField,
  styled,
} from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';

import { useDispatch, useSelector } from 'react-redux';
import { selectLabels } from '@Redux/pmtools/board/selectors';
import fuzzysort from 'fuzzysort';
import { requestDeleteProjectLabel } from '@Redux/pmtools/board/actions/labels';
import AddTag from './AddTag';
import ListItem from './ListItem';

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
interface Props {
  selected: number[];
  onChange(labels: number[]): void;
  onClose(): void;
}

const AllTags = ({ selected, onChange, onClose }: Props) => {
  const labels = useSelector(selectLabels);

  const dispatch = useDispatch();

  const [searchText, setSearchText] = useState('');
  const [showAddLabel, setShowAddLabel] = useState(labels.length < 1);

  const handleHideAddTags = useCallback(() => {
    setShowAddLabel(false);
  }, [setShowAddLabel]);

  const handleToggle = useCallback(
    (id) => {
      const currentIndex = selected.indexOf(id);
      const newSelected = [...selected];

      if (currentIndex === -1) {
        newSelected.push(id);
      } else {
        newSelected.splice(currentIndex, 1);
      }
      onChange(newSelected);
    },
    [selected, onChange],
  );

  const filteredLabels = useMemo(() => {
    if (searchText.trim().length) {
      return fuzzysort
        .go(searchText.trim(), labels, {
          keys: ['text'],
        })
        .map((r) => r.obj);
    }

    return labels;
  }, [searchText, labels]);

  const handleChangeSearchText = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(e.target.value);
    },
    [setSearchText],
  );

  const handleDelete = useCallback(
    (id) => {
      dispatch(requestDeleteProjectLabel(id));
    },
    [dispatch],
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
            onChange={handleChangeSearchText}
            value={searchText}
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
        {filteredLabels.map((label) => (
          <ListItem
            selected={selected.indexOf(label.id) !== -1}
            key={label.id.toString()}
            label={label}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
      </List>
    </SearchWrapper>
  );
};

export default AllTags;
