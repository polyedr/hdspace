import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { createStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import convertDateToRelative from '../../utils/convertDateToRelative';
import { Project } from '../../api/types';
import { delProject, renameProject } from '../../redux/project/actions';
import Dialog from '../UI/Dialog';

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
  }),
);

type Props = {
  project: Project;
};

const ProjectListItem: React.FC<Props> = ({
  project: { status, id, name, updated, projectscreen },
}) => {
  const dispatch = useDispatch();
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
    dispatch(delProject(id));
    closeModal();
  };

  return (
    <>
      <TableRow>
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
        confirm
      />
    </>
  );
};

export default ProjectListItem;
