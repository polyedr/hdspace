import React, { memo, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { createProject, getProjectList } from '@Redux/project/actions';
import {
  selectAreProjectsLoading,
  selectProjectCreateLoader,
  selectProjects,
  selectProjectsDataNext,
} from '@Redux/project/selectors/base';
import Searchbar from '@Components/Projects/Searchbar';
import UserPermissionsModal from '@Components/Dialogs/UserPermissionsModal';
import {
  Paper,
  Typography,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TableContainer,
  Container,
  CircularProgress,
} from '@material-ui/core';
import ProjectListItem from './ProjectListItem';

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
    cellStatus: {
      width: 200,
    },
    cellName: {
      width: 400,
      minWidth: 400,
    },
  }),
);

const Projects: React.FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const ref = useRef<HTMLTableRowElement>(null);
  const el = ref && ref.current;

  const [
    permissionsManagementProjectId,
    setPermissionsManagementProjectId,
  ] = useState<number | null>(null);

  const projects = useSelector(selectProjects);
  const projectListLoader = useSelector(selectAreProjectsLoading);
  const projectCreateLoader = useSelector(selectProjectCreateLoader);
  const hasNext = useSelector(selectProjectsDataNext);

  useEffect(() => {
    dispatch(getProjectList());
  }, [dispatch]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
  }, [el, handleGetProjects]);

  const sortedProjectList = Object.values(projects).sort(
    (a, b) => b.created.getTime() - a.created.getTime(),
  );

  const handleProjectAdd = () => {
    dispatch(createProject('AProject'));
  };

  return (
    <Container maxWidth="lg">
      <Paper className={classes.root}>
        <div className={classes.header}>
          <Typography variant="h5" className={classes.headerText}>
            All projects
          </Typography>

          <Searchbar />

          <Button
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
                <TableCell className={classes.cellStatus}>
                  Project Status
                </TableCell>

                <TableCell className={classes.cellName}>Project Name</TableCell>

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
                  onPermissionsManagementClick={(projectId) => {
                    setPermissionsManagementProjectId(projectId);
                  }}
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
      {!!sortedProjectList.length && (
        <UserPermissionsModal
          projectId={permissionsManagementProjectId}
          onClose={() => setPermissionsManagementProjectId(null)}
        />
      )}
    </Container>
  );
};

export default memo(Projects);
