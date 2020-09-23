import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { lighten } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { useDispatch } from 'react-redux';
import { Form, Field } from 'react-final-form';
import { Screen } from '../../redux/project/types';
import ScreenControls from './ScreenControls';
import ScreenLogo from './ScreenLogo';
import { renameScreen } from '../../redux/project/actions';

const useStyles = makeStyles({
  listItem: {
    '&:hover': {
      backgroundColor: lighten('#2f4050', 0.07),
    },
    '&, &:hover, &:active, &:link, &:visited, &:focus': {
      color: 'inherit',
      textDecoration: 'none',
    },
    padding: '.5em',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  active: {
    backgroundColor: lighten('#2f4050', 0.1),
  },
  screenData: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    color: '#eee',
    minWidth: 0,
    paddingRight: '.5em',
  },
});

type Props = {
  screen: Screen;
};

const ScreenListItem: React.FC<Props> = ({ screen }) => {
  const dispatch = useDispatch();
  const { name, project, id, image } = screen;
  const classes = useStyles();
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);

  const handleMouseEnter = () => setShow(true);
  const handleMouseLeave = () => setShow(false);

  const openEdit = () => setEdit(true);
  const closeEdit = () => setEdit(false);

  const handleSubmit = async (values) => {
    dispatch(renameScreen(project, id, values.name));
    closeEdit();
  };

  return (
    <>
      <ListItem
        button
        component={NavLink}
        to={`/project/${project}/${id}`}
        activeClassName={classes.active}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={classes.listItem}
      >
        <div className={classes.screenData}>
          <ListItemIcon className={classes.icon}>
            <ScreenLogo image={image} />
          </ListItemIcon>

          <span>{name}</span>
        </div>

        {/* it's a bad practice to place interactive elements into anchor, but the app design is going to change soon */}
        <ScreenControls
          show={show}
          screen={screen}
          openEdit={openEdit}
          closeEdit={closeEdit}
        />
      </ListItem>

      <Dialog open={edit} onClose={closeEdit}>
        <Form
          onSubmit={handleSubmit}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <DialogTitle>Rename Screen</DialogTitle>

              <DialogContent>
                <DialogContentText>
                  Enter screen&apos;s new name
                </DialogContentText>

                <Field name="name" initialValue={name}>
                  {({ input }) => (
                    <TextField
                      autoFocus
                      margin="dense"
                      type="text"
                      fullWidth
                      {...input}
                    />
                  )}
                </Field>
              </DialogContent>

              <DialogActions>
                <Button onClick={closeEdit} color="primary">
                  Cancel
                </Button>

                <Button type="submit" color="primary">
                  Confirm
                </Button>
              </DialogActions>
            </form>
          )}
        />
      </Dialog>
    </>
  );
};

export default ScreenListItem;
