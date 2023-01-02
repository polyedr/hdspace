/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStyles, makeStyles } from '@mui/styles';
import {
  selectAreProjectsLoading,
  selectProjectCreateLoader,
  selectProjects,
  selectProjectsDataNext,
} from '@Redux/project/selectors/base';
import Searchbar from '@Components/Projects/Searchbar';
import UserPermissionsModal from '@Components/Dialogs/UserPermissionsModal';
import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TableContainer,
  Container,
  CircularProgress,
  Theme,
} from '@mui/material';
import {
  createProject,
  getProjectList,
  setProjectError,
} from '@Redux/project/actions';
import { getSubscriptionData } from '@Redux/permissions/actions';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { selectSubscriptionData } from '@Redux/user/selectors';
import { selectProjectError } from '@Redux/project/selectors/via';
import ProjectListItem from './ProjectListItem';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      // textAlign: 'center',
      margin: theme.spacing(2),
      padding: theme.spacing(1),
    },
    header: {
      padding: theme.spacing(1),
      display: 'flex',
      flexDirection: 'column',
      gap: '25px',
    },
    headerAction: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
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
      minWidth: 250,
    },
    cellTags: {
      minWidth: 200,
    },
    buttonFont: {
      fontSize: '18px',
      fontFamily: 'Roboto',
      color: '#2A2A2D',
      paddingLeft: '10px',
    },
    typographySize: {
      marginTop: '12px',
      fontSize: '14px',
      fontFamily: 'Roboto',
      color: '#2A2A2D',
      paddingLeft: '10px',
    },
  }),
);

const Projects: React.FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const ref = useRef<HTMLTableRowElement>(null);
  const el = ref && ref.current;

  const [permissionsManagementProjectId, setPermissionsManagementProjectId] =
    useState<number | null>(null);

  const projects = useSelector(selectProjects);
  const projectListLoader = useSelector(selectAreProjectsLoading);
  const projectCreateLoader = useSelector(selectProjectCreateLoader);
  const hasNext = useSelector(selectProjectsDataNext);
  const userSubscriptionData = useSelector(selectSubscriptionData);
  const projectErrorData = useSelector(selectProjectError);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(getProjectList());
  }, [dispatch]);

  const handleGetProjects = () => {
    if (hasNext) {
      dispatch(getProjectList());
    }
  };

  useEffect(() => {
    if (projectErrorData === 'Maximum count of projects reached.') {
      setShowModal(true);
    }
  }, [projectErrorData]);
  useEffect(() => {
    dispatch(getSubscriptionData());
  }, []);

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

  const handleProjectAdd = () =>
    userSubscriptionData === null
      ? setShowModal(true)
      : dispatch(createProject('AProject'));
  const handleModalClose = () => {
    dispatch(setProjectError(null));
    setShowModal(false);
  };

  return (
    <Container maxWidth="lg">
      <div className={classes.root}>
        <div className={classes.header}>
          <Typography variant="h5" className={classes.headerText}>
            All projects
          </Typography>
          <div className={classes.headerAction}>
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
        </div>

        <TableContainer className={classes.table}>
          <Table size="small">
            <TableHead className={classes.tableHeader}>
              <TableRow>
                <TableCell className={classes.cellName}>Project Name</TableCell>

                <TableCell className={classes.cellTags}>Tags</TableCell>

                <TableCell className={classes.cellStatus}>
                  Project Status
                </TableCell>

                <TableCell>Date of creation</TableCell>

                <TableCell>Last Edit</TableCell>

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
      </div>
      {!!sortedProjectList.length && (
        <UserPermissionsModal
          projectId={permissionsManagementProjectId}
          onClose={() => setPermissionsManagementProjectId(null)}
        />
      )}
      <Modal open={showModal}>
        <Box
          sx={{
            position: 'absolute',
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
          <Typography className={classes.buttonFont}>
            subscription violation
          </Typography>
          <Typography className={classes.typographySize}>
            {userSubscriptionData === null ? (
              <span>
                You need to have active subscription to create projects. Go to
                subscription plans ?
              </span>
            ) : null}

            {projectErrorData === 'Maximum count of projects reached.' ? (
              <span>
                You have reached maximum number of projects. Do you want to
                upgrade your subscription ?
              </span>
            ) : null}
          </Typography>
          <Box
            sx={{
              marginTop: '30px',
              display: 'flex',
              justifyContent: 'center',
            }}
            gap={2}
          >
            <a
              href="https://adevi.clickfunnels.com/orderju32fma6"
              style={{ textDecoration: 'none' }}
              rel="noreferrer"
            >
              <Button
                variant="contained"
                color="secondary"
                className={classes.createButton}
                onClick={handleModalClose}
              >
                Yes
              </Button>
            </a>
            <Button
              variant="contained"
              className={classes.createButton}
              onClick={handleModalClose}
            >
              No
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default memo(Projects);
