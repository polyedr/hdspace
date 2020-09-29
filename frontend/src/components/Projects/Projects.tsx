import React, { memo, useEffect, useRef } from 'react';
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
import Container from '@material-ui/core/Container';
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

  const ref = useRef<HTMLTableRowElement>(null);
  const el = ref && ref.current;

  const projectList = useSelector(selectProjects);
  const projectListLoader = useSelector(selectAreProjectsLoading);
  const allProjectsLoaded = useSelector(selectAllProjectsLoaded);

  useEffect(() => {
    dispatch(getProjectList());
  }, [dispatch]);

  const handleGetProjects = () => {
    if (!allProjectsLoaded) {
      dispatch(getProjectList());
    }
  };

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          handleGetProjects();
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 1,
      },
    );

    if (el) {
      obs.observe(el);
    }

    return () => {
      if (el) {
        obs.unobserve(el);
      }
    };
  }, [el]);

  const sortedProjectList = R.sort(
    R.descend((project: Project) => project.created.getTime()),
    projectList,
  );

  const handleProjectAdd = () => {
    dispatch(addProject('AProject'));
  };

  return (
    <Container maxWidth="lg">
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
                {sortedProjectList.map((project, i) => (
                  <ProjectListItem
                    project={project}
                    key={project.id}
                    ref={i === projectList.length - 1 ? ref : undefined}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Spinner active={projectListLoader} />
      </Paper>
    </Container>
  );
};

export default memo(Projects);
