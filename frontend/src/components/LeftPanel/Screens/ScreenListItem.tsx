import React, { useState, useCallback, MouseEvent } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { makeStyles } from '@mui/styles';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';
import { useHistory } from 'react-router';
import {
  editScreenNameAndData,
  setActiveElement,
  deleteScreen,
} from '@Redux/project/actions';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import {
  ListItem,
  ListItemIcon,
  Box,
  Modal,
  Button,
  Typography,
  Theme,
} from '@mui/material';
import { Screen } from '../../../types';
import ScreenLogo from './ScreenLogo';
import ScreenEditDialog from './ScreenEditDialog';
import ScreenLongName from './ScreenLongName';
import ContextMenu from './ContextMenu';

const useStyles = makeStyles<Theme>(({ typography }) => ({
  listItem: {
    '&:hover': {
      backgroundColor: '#F3F4F6',
    },
    '&, &:hover, &:active, &:link, &:visited, &:focus': {
      color: 'inherit',
      textDecoration: 'none',
    },
    whiteSpace: 'nowrap',
    padding: '.5em',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  active: {
    backgroundColor: '#F3F4F6',
  },
  screenData: {
    marginLeft: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  icon: {
    color: '#81818E',
    minWidth: 0,
    paddingRight: '.1em',
  },
  name: {
    fontFamily: typography.fontFamily,
    fontSize: 11,
  },
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: '8px',
  },
}));

interface Props {
  screen: Screen;
  index: number;
  active: boolean;
}
interface State {
  mouseX: number | null;
  mouseY: number | null;
}

const ScreenListItem: React.FC<Props> = ({ screen, index, active }) => {
  const dispatch = useDispatch();
  const { name, project, id, image, screenData, element } = screen;
  const initialState: State = {
    mouseX: null,
    mouseY: null,
  };
  const [state, setState] = useState<State>(initialState);
  const classes = useStyles();
  const history = useHistory();
  const currentProjectId = useSelector(selectCurrentProjectId);
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const handleMouseLeave = useCallback(() => setShow(false), []);
  const handleMouseOver = useCallback(() => !show && setShow(true), [show]);

  const openEdit = () => setEdit(true);
  const closeEdit = () => setEdit(false);

  const handleSubmit = async (values) => {
    const { name: newScreenName, faviconUrl, ...metaValues } = values;
    dispatch(
      editScreenNameAndData(project, id, {
        name: newScreenName,
        data: {
          meta: {
            ...metaValues,
            faviconUrl: faviconUrl || null,
          },
        },
      }),
    );
    closeEdit();
  };
  const handleClick = () => {
    dispatch(setActiveElement(element));
    history.push(`/project/${currentProjectId}/${screen.id}`);
  };

  const handleMenuOpen = (ev: MouseEvent<HTMLDivElement>) => {
    ev.preventDefault();
    setState({
      mouseX: ev.clientX - 2,
      mouseY: ev.clientY - 4,
    });
  };
  const handleDeleteClose = () => {
    dispatch(deleteScreen(project, id));
    setDeleteModal(false);
  };
  const handleDeleteOpen = () => {
    setDeleteModal(true);
  };

  const handleClose = () => setState(initialState);

  return (
    <Draggable draggableId={screen.id.toString()} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <ListItem
            button
            onClick={handleClick}
            onMouseLeave={handleMouseLeave}
            onMouseOver={handleMouseOver}
            onContextMenu={handleMenuOpen}
            className={cn(classes.listItem, active && classes.active)}
          >
            <div className={classes.screenData}>
              <ListItemIcon className={classes.icon}>
                <ScreenLogo image={image} />
              </ListItemIcon>
              {name.length > 10 ? (
                <ScreenLongName
                  name={name}
                  styles={{
                    name: classes.name,
                    popover: classes.popover,
                    paper: classes.paper,
                  }}
                />
              ) : (
                <span className={classes.name}>{name}</span>
              )}
            </div>
            <ContextMenu
              open={state?.mouseY !== null}
              screen={screen}
              anchorPosition={
                state.mouseY !== null && state.mouseX !== null
                  ? { top: state.mouseY, left: state.mouseX }
                  : undefined
              }
              onClose={handleClose}
              openEdit={openEdit}
              openDelete={handleDeleteOpen}
            />
          </ListItem>
          <ScreenEditDialog
            open={edit}
            onSubmit={handleSubmit}
            onClose={closeEdit}
            titleDialog="Rename Screen"
            initialValueName={name}
            initialValueTags={screenData?.meta || {}}
            currentScreenId={id}
            project={project}
          />
          <Modal open={deleteModal}>
            <Box
              sx={{
                position: 'absolute' as 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 420,
                bgcolor: 'background.paper',
                borderRadius: '6px',
                boxShadow: 24,
                p: 4,
              }}
            >
              <Typography
                sx={{
                  fontSize: '18px',
                  fontWeight: '600',
                  fontFamily: 'Roboto',
                  color: '#2A2A2D',
                }}
              >
                Delete Screen
              </Typography>
              <Typography
                sx={{
                  marginTop: '12px',
                  fontSize: '14px',
                  fontFamily: 'Roboto',
                  color: '#2A2A2D',
                }}
              >
                Are you sure you want to delete the {screen.name} screen?
              </Typography>
              <Box
                sx={{
                  marginTop: '20px',
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
                gap={2}
              >
                <Button
                  sx={{
                    color: '#81818E',
                    fontWeight: '500',
                    textTransform: 'capitalize',
                  }}
                  onClick={() => {
                    setDeleteModal(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#5064FF',
                    fontWeight: '500',
                    textTransform: 'capitalize',
                  }}
                  onClick={handleDeleteClose}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          </Modal>
        </div>
      )}
    </Draggable>
  );
};

export default ScreenListItem;
