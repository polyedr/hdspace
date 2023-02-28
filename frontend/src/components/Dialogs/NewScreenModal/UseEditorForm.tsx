import { Button, TextField } from '@mui/material';
import { FC, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { uniq } from 'ramda';
import { convertElementToData } from '@Utils/elementsHierarchy';
import { LIBRARY_ELEMENTS } from '@Domain/libraryElements/libraryElements';
import { renderElementButtons } from '@Components/RightPanel/ElementsTab/ElementsBlock';

const useStyles = makeStyles({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actions: {
    textAlign: 'right',
  },
  container: {
    minHeight: 154,
    display: 'flex',
    flexFlow: 'row wrap',
    padding: '0 2px 2px',
    '& > *': {
      width: 'calc(300px/4)',
      height: 'calc(300px/4)',
    },
  },
});

interface Props {
  onClose: (...args: any) => void;
}

const UseEditorForm: FC<Props> = ({ onClose }) => {
  const classes = useStyles();

  const [query, setQuery] = useState('');

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        Find elements using search bar and add them to the screen of just use
        the right panel
      </div>

      <TextField
        variant="outlined"
        margin="dense"
        placeholder="Element name"
        label="Find elements"
        value={query}
        onChange={(ev) => setQuery(ev.target.value)}
      />

      <div className={classes.container}>
        {query &&
          renderElementButtons(
            Object.fromEntries(
              uniq(Object.values(LIBRARY_ELEMENTS))
                .map((value) => value())
                .filter((value) =>
                  value.func_type.toLowerCase().includes(query.toLowerCase()),
                )
                .map((value) => [value.func_type, convertElementToData(value)]),
            ),
          )}
      </div>

      <div className={classes.actions}>
        <Button variant="contained" color="secondary" onClick={onClose}>
          Start
        </Button>
      </div>
    </div>
  );
};

export default UseEditorForm;
