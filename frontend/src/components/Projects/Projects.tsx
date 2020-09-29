import React, { memo, useEffect } from 'react';
import * as R from 'ramda';
import { useDispatch, useSelector } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { createStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Button from '@material-ui/core/Button';
import TableContainer from '@material-ui/core/TableContainer';
import ProjectListItem from './ProjectListItem';
import { addProject, getProjectList } from '../../redux/project/actions';
import {
  selectAllProjectsLoaded,
  selectAreProjectsLoading,
  selectProjects,
} from '../../redux/project/selectors';
import Spinner from '../UI/Spinner';
import { Project } from '../../api/types';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      margin: theme.spacing(2),
      padding: theme.spacing(1),
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing(1),
    },
    headerText: {
      fontWeight: 'bold',
    },
    table: {
      padding: theme.spacing(1),
    },
    tableHeader: {
      backgroundColor: '#dedede',
    },
  }),
);

const Projects: React.FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const projectList = useSelector(selectProjects);
  const projectListLoader = useSelector(selectAreProjectsLoading);
  const allProjectsLoaded = useSelector(selectAllProjectsLoaded);

  const sortedProjectList = R.sort(
    R.descend((project: Project) => project.created.getTime()),
    projectList,
  );

  useEffect(() => {
    dispatch(getProjectList());
  }, [dispatch]);

  const handleProjectAdd = () => {
    dispatch(addProject('AProject'));
  };

  const handleGetProjects = () => {
    dispatch(getProjectList());
  };

  return (
    <Paper className={classes.root}>
      <div className={classes.header}>
        <Typography variant="h5" className={classes.headerText}>
          All projects
        </Typography>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleProjectAdd}
        >
          Create a project
        </Button>
      </div>

      <Divider />

      {projectList.length !== 0 && (
        <TableContainer className={classes.table}>
          <Table size="small">
            <TableHead className={classes.tableHeader}>
              <TableRow>
                <TableCell>Project Status</TableCell>

                <TableCell>Project Name</TableCell>

                <TableCell>Last Edit</TableCell>

                <TableCell>Total Pages</TableCell>

                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {sortedProjectList.map((project) => (
                <ProjectListItem project={project} key={project.id} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {!allProjectsLoaded && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleGetProjects}
          disabled={projectListLoader}
        >
          Load more
        </Button>
      )}

      <Spinner active={projectListLoader} />
    </Paper>
  );
};

export default memo(Projects);
