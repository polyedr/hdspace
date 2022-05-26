import React, { useEffect, useState } from 'react';
import {
  Checkbox,
  Chip,
  Paper,
  Typography,
  TextField,
  Grid,
  Button,
  InputAdornment,
} from '@material-ui/core';
import { Check, Search } from '@material-ui/icons';
import { makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ spacing }) =>
  createStyles({
    tagPopup: {
      padding: spacing(2),
    },
    tagColor: {
      borderRadius: 4,
      width: 24,
      height: 24,
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    chip: {
      height: 28,
      color: '#FFF',
    },
    tagList: {
      maxHeight: 225,
      overflow: 'auto',
      flexWrap: 'nowrap',
    },
  }),
);

const colors = [
  '#F3F4F6',
  '#EF3052',
  '#FAB200',
  '#FF9950',
  '#1CC09F',
  '#2C8DA3',
  '#5064FF',
  '#7243F8',
  '#D613AB',
];

const ColorTag = (props) => {
  const { selected, index, onSelect } = props;
  const classes = useStyles();

  return (
    <div
      className={classes.tagColor}
      style={{ backgroundColor: colors[index] }}
      onClick={() => onSelect(index)}
    >
      {selected && <Check fontSize="small" />}
    </div>
  );
};

export interface Tag {
  name: string;
  color: string;
}

type Props = {
  tagsData: Tag[];
  selectedTags: Tag[];
  onAdd: Function;
  onClose: Function;
  onCheck: Function;
};

const AddTags: React.FC<Props> = ({
  tagsData,
  onAdd,
  onClose,
  selectedTags,
  onCheck,
}) => {
  const classes = useStyles();

  const [selIndex, setSelIndex] = useState(0);
  const [addMode, setAddMode] = useState(tagsData.length === 0);
  const [tagName, setTagName] = useState('');
  const [displayTags, setDisplayTags] = useState(tagsData);

  const handleSelect = (idx: number) => {
    setSelIndex(idx);
  };

  const handleAdd = () => {
    onAdd({
      name: tagName,
      color: colors[selIndex],
    });
  };

  const handleSearch = (e) => {
    const searchName = e.target.value.trim().toLowerCase();
    let result: Tag[] = tagsData.slice();
    if (searchName) {
      result = tagsData.filter((item) =>
        item.name.toLowerCase().includes(searchName),
      );
    }
    setDisplayTags(result);
  };

  const handleCheck = (value: Tag) => {
    onCheck(value);
  };

  return (
    <Paper className={classes.tagPopup}>
      {addMode ? (
        <Grid container spacing={2} direction="column">
          <Grid item>
            <Typography variant="body1">New Tag</Typography>
          </Grid>
          <Grid item>
            <TextField
              placeholder="Type tag"
              variant="outlined"
              inputProps={{
                style: {
                  padding: '7px 15px',
                },
              }}
              onChange={(e) => setTagName(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid container item spacing={1}>
            {colors.map((_, index) => (
              <Grid item key={colors[index]}>
                <ColorTag
                  index={index}
                  onSelect={handleSelect}
                  selected={index === selIndex}
                />
              </Grid>
            ))}
          </Grid>
          <Grid container item spacing={2} justifyContent="flex-end">
            <Grid item>
              <Button color="primary" onClick={() => onClose()}>
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                color="primary"
                variant="contained"
                onClick={handleAdd}
                disabled={!tagName.trim()}
                style={{ backgroundColor: '#5064FF' }}
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={2} direction="column">
          <Grid item>
            <TextField
              placeholder="search"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              onChange={handleSearch}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              fullWidth
              onClick={() => setAddMode(true)}
            >
              New Tag
            </Button>
          </Grid>
          <Grid
            container
            item
            spacing={2}
            direction="column"
            className={classes.tagList}
          >
            {displayTags.map((item) => (
              <Grid
                container
                spacing={1}
                alignItems="center"
                key={`${item.name}${item.color}`}
              >
                <Grid item>
                  <Checkbox
                    defaultChecked={
                      selectedTags.findIndex((tag) => tag.name === item.name) >
                      -1
                    }
                    color="primary"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                    onChange={() => handleCheck(item)}
                  />
                </Grid>
                <Grid item>
                  <Chip
                    label={item.name}
                    style={{ backgroundColor: item.color }}
                    className={classes.chip}
                  />
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
      )}
    </Paper>
  );
};

export default AddTags;
