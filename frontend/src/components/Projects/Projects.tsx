import React, { memo, useEffect, useRef, useState } from 'react';
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
import CircularProgress from '@material-ui/core/CircularProgress';
import { createProject, getProjectList } from '@Redux/project/actions';
import {
  selectAreProjectsLoading,
  selectProjectCreateLoader,
  selectProjects,
  selectProjectsDataNext,
} from '@Redux/project/selectors/base';
import Searchbar from '@Components/Projects/Searchbar';
import Tour, { ReactourStep } from 'reactour';
import { ELEMENT_IDS } from '@Constants/pathNames';
import ProjectListItem from './ProjectListItem';

const tourSteps: ReactourStep[] = [
  {
    selector: `#${ELEMENT_IDS.avatar}`,
    content: 'Avatar leads to Profile page',
  },
  {
    selector: `#${ELEMENT_IDS.projectSearch}`,
    content: 'You can search through your projects using this searchbar',
  },
  {
    selector: `#${ELEMENT_IDS.createProject}`,
    content: 'Create new project using this button',
  },
];

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      // textAlign: 'center',
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
    loader: {
      padding: '1em',
      textAlign: 'center',
    },
    createButton: {
      minWidth: 160,
    },
  }),
);

const Projects: React.FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const ref = useRef<HTMLTableRowElement>(null);
  const el = ref && ref.current;

  const projects = useSelector(selectProjects);
  const projectListLoader = useSelector(selectAreProjectsLoading);
  const projectCreateLoader = useSelector(selectProjectCreateLoader);
  const hasNext = useSelector(selectProjectsDataNext);

  const [tour, setTour] = useState(true);

  useEffect(() => {
    dispatch(getProjectList());
  }, [dispatch]);

  const handleGetProjects = () => {
    if (hasNext) {
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
        threshold: 0.01,
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

  const sortedProjectList = Object.values(projects).sort(
    (a, b) => b.created.getTime() - a.created.getTime(),
  );

  const handleProjectAdd = () => {
    dispatch(createProject('AProject'));
  };

  return (
    <Container maxWidth="lg">
      <Tour
        isOpen={tour}
        steps={tourSteps}
        onRequestClose={() => setTour(false)}
      />

      <Paper className={classes.root}>
        <div className={classes.header}>
          <Typography variant="h5" className={classes.headerText}>
            All projects
          </Typography>

          <Searchbar />

          <Button
            id={ELEMENT_IDS.createProject}
            variant="contained"
            color="secondary"
            onClick={handleProjectAdd}
            disabled={projectCreateLoader}
            className={classes.createButton}
          >
            {!projectCreateLoader ? (
              'Create a project'
            ) : (
              <CircularProgress size={24} />
            )}
          </Button>
        </div>

        <Divider />

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
                  ref={i === sortedProjectList.length - 1 ? ref : undefined}
                />
              ))}

              {projectListLoader && (
                <TableRow>
                  <TableCell colSpan={5} className={classes.loader}>
                    <CircularProgress color="secondary" />
                  </TableCell>
                </TableRow>
              )}

              {!sortedProjectList.length && !projectListLoader && (
                <TableRow>
                  <TableCell colSpan={5} className={classes.loader}>
                    No projects found :(
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default memo(Projects);
