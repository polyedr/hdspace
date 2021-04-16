import { renderElementButtons } from '@Components/RightPanel/ElementsTab/ElementsBlock';
import { LIBRARY_ELEMENTS } from '@Domain/libraryElements/libraryElements';
import { Button, TextField } from '@material-ui/core';
import { convertElementToData } from '@Utils/elementsHierarchy';
import React, { FC, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { makeStyles } from '@material-ui/core/styles';

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

type Props = {
  onClose: (...args: any) => void;
};

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
        <DndProvider backend={HTML5Backend}>
          {query &&
            renderElementButtons(
              Object.fromEntries(
                Object.entries(LIBRARY_ELEMENTS)
                  .filter(([key]) =>
                    key.toLowerCase().includes(query.toLowerCase()),
                  )
                  .map(([key, value]) => [key, convertElementToData(value)]),
              ),
            )}
        </DndProvider>
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
