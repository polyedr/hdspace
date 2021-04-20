import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import GroupIcon from '@material-ui/icons/Group';
import convertDateToRelative from '@Utils/convertDateToRelative';
import { deleteProject, renameProject } from '@Redux/project/actions';
import { selectUserData } from '@Redux/user/selectors';
import { TableRow, TableCell, Typography, IconButton } from '@material-ui/core';
import Dialog from '../Dialogs/Dialog';
import { Project } from '../../types';

const useStyles = makeStyles((theme) =>
  createStyles({
    link: {
      '&, &:active, &:focus, &:link': {
        fontWeight: 'bold',
        color: theme.palette.link.main,
        textDecoration: 'none',
      },
      '&:hover': {
        color: theme.palette.link.light,
      },
    },
    tableRow: {
      height: '5em',
    },
  }),
);

type Props = {
  project: Project;
  onPermissionsManagementClick: (projectId: number) => void;
};

type Ref = HTMLTableRowElement;

const ProjectListItem = React.forwardRef<Ref, Props>(
  (
    {
      project: { status, id, name, updated, projectscreen, user },
      onPermissionsManagementClick,
    },
    ref,
  ) => {
    const dispatch = useDispatch();
    const userData = useSelector(selectUserData);
    const classes = useStyles();

    const [renameOpen, setRenameOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const closeModal = () => {
      setRenameOpen(false);
      setDeleteOpen(false);
    };

    const handleRenameProject = () => {
      setRenameOpen(true);
    };

    const handleDeleteProject = () => {
      setDeleteOpen(true);
    };

    const onRenameProject = async (values) => {
      dispatch(renameProject(id, values.name));
      closeModal();
    };

    const onDeleteProject = () => {
      dispatch(deleteProject(id));
      closeModal();
    };

    return (
      <>
        <TableRow className={classes.tableRow} ref={ref}>
          <TableCell>
            <Typography color="secondary">{status}</Typography>
          </TableCell>

          <TableCell>
            <Link to={`/project/${id}`} className={classes.link}>
              {name}
            </Link>
          </TableCell>

          <TableCell>
            <Typography variant="caption">
              {convertDateToRelative(updated)}
            </Typography>
          </TableCell>

          <TableCell>{projectscreen.length}</TableCell>

          <TableCell>
            <IconButton size="small" onClick={handleRenameProject}>
              <EditIcon fontSize="small" />
            </IconButton>

            {user.id === userData.id && (
              <IconButton
                size="small"
                onClick={() => onPermissionsManagementClick(id)}
              >
                <GroupIcon fontSize="small" />
              </IconButton>
            )}

            <IconButton size="small" onClick={handleDeleteProject}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </TableCell>
        </TableRow>

        <Dialog
          open={renameOpen}
          onSubmit={onRenameProject}
          onClose={closeModal}
          title="Rename Project"
          fieldName="name"
          initialValue={name}
          description={`Enter new name for ${name}`}
        />

        <Dialog
          open={deleteOpen}
          onSubmit={onDeleteProject}
          onClose={closeModal}
          title="Delete Project"
          description={`This project named as ${name} and its styles, pages, and images will be deleted permanently!`}
          withoutField
        />
      </>
    );
  },
);

export default ProjectListItem;
