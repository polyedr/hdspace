import React, { useEffect } from 'react';
import {
  Stack,
  Box,
  Grid,
  styled,
  IconButton,
  Link,
  Typography,
  ListItemText,
  List,
  ListItemButton,
  Collapse,
} from '@mui/material';
import {
  FolderOutlined,
  VisibilityOutlined,
  Add,
  ExpandMore,
  ExpandLess,
  Remove,
  Crop32,
} from '@mui/icons-material';
import {
  PropertyAccordion,
  PropertyAccordianSummary,
  PropertyAccordionDetails,
} from '../styledComponents';
import Canvas from './Canvas';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { getProject } from '@Redux/project/actions';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import { selectScreens } from '@Redux/project/selectors/screen';

interface Props {
  projectId: number;
  screenId?: number;
  elementId?: string;
}

const LeftpanelBox = styled(Box)({
  backgroundColor: 'white',
  height: '100%',
  borderRight: '1px solid #E4E6EB',
  paddingTop: 20,
});

const RightpanelBox = styled(Box)({
  backgroundColor: 'white',
  height: '100%',
  borderLeft: '1px solid #E4E6EB',
});

const TopStack = styled(Stack)({
  borderBottom: '1px solid #E4E6EB',
  paddingLeft: 15,

  '& svg': {
    fontSize: 20,
  },

  '& p': {
    margin: 0,
    fontWeight: 500,
  },
});

const CustomList = styled(List)({
  '& .MuiListItemText-root': {
    margin: 0,
  },
});

const ListWithBorder = styled(List)({
  '& > .MuiListItemButton-root': {
    borderTop: '1px solid #E4E6EB',
    borderBottom: '1px solid #E4E6EB',
  },
  '& .MuiListItemText-root': {
    margin: 0,
  },
});

const CustomBox = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '5px 12px',

  '&	.MuiTypography-root': {
    fontWeight: 500,
  },
});

interface Props {
  projectId: number;
  screenId?: number;
}

const Wireframe: React.FC<Props> = ({ projectId, screenId: _ }) => {
  const screens = useSelector(selectScreens);
  const currentProjectId = useSelector(selectCurrentProjectId);
  const [open, setOpen] = React.useState(false);

  const dispatch = useDispatch();

  const handleClick = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (currentProjectId !== projectId) {
      dispatch(getProject(projectId));
    }
  }, [dispatch, currentProjectId, projectId]);

  if (!currentProjectId || !screens || Object.keys(screens).length < 1) {
    return null;
  }

  return (
    <>
      <Stack sx={{ height: '100%' }}>
        <Grid container columnSpacing={2} flex={1}>
          <Grid item xs={2}>
            <LeftpanelBox>
              <TopStack
                flexDirection={'row'}
                alignItems={'center'}
                justifyContent={'space-between'}
              >
                <Typography>Flow</Typography>
                <Box>
                  <IconButton>
                    <VisibilityOutlined />
                  </IconButton>
                  <IconButton>
                    <Add />
                  </IconButton>
                  <IconButton>
                    <FolderOutlined />
                  </IconButton>
                </Box>
              </TopStack>
              <Box sx={{ borderBottom: '1px solid #E4E6EB' }}>
                <Link
                  href="#"
                  underline="none"
                  color="#000"
                  sx={{ padding: '10px 15px', display: 'inline-block' }}
                >
                  {'Forgot Password'}
                </Link>
              </Box>
              <PropertyAccordion>
                <PropertyAccordianSummary expandIcon={<ExpandMore />}>
                  buy product
                </PropertyAccordianSummary>
                <PropertyAccordionDetails>
                  <CustomList disablePadding={true}>
                    <ListItemButton>
                      <ListItemText primary="Home Screen" />
                    </ListItemButton>
                    <ListItemButton>
                      <ListItemText primary="Products" />
                    </ListItemButton>
                  </CustomList>
                </PropertyAccordionDetails>
              </PropertyAccordion>
              <PropertyAccordion>
                <PropertyAccordianSummary expandIcon={<ExpandMore />}>
                  Registration
                </PropertyAccordianSummary>
                <PropertyAccordionDetails>
                  <CustomList disablePadding={true}>
                    <ListItemButton onClick={handleClick}>
                      <ListItemText primary="Login or Sign up" />
                      {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }}>
                          <ListItemText primary="Login" />
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }}>
                          <ListItemText primary="Sign up" />
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }}>
                          <ListItemText primary="check your email" />
                        </ListItemButton>
                      </List>
                    </Collapse>
                  </CustomList>
                </PropertyAccordionDetails>
              </PropertyAccordion>
            </LeftpanelBox>
          </Grid>
          <Grid item xs={8}>
            <DndProvider backend={HTML5Backend}>
              <Canvas screens={screens} />
            </DndProvider>
          </Grid>
          <Grid item xs={2}>
            <RightpanelBox>
              <PropertyAccordion>
                <PropertyAccordianSummary expandIcon={<ExpandMore />}>
                  connect
                </PropertyAccordianSummary>
                <PropertyAccordionDetails>
                  <Box
                    sx={{ border: '1px solid #E4E6EB', borderRadius: '5px' }}
                  >
                    <CustomBox>
                      <Typography>Trigger</Typography>
                      <Add />
                    </CustomBox>
                    <CustomBox sx={{ color: '#81818E' }}>
                      <Typography
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <Crop32 /> Button
                      </Typography>
                      <Remove />
                    </CustomBox>
                    <ListWithBorder disablePadding={true}>
                      <ListItemButton onClick={handleClick}>
                        <ListItemText primary="Click" />
                        {open ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                      <Collapse in={open} timeout="auto" unmountOnExit>
                        <List disablePadding>
                          <ListItemButton
                            sx={{ pl: 4, borderBottom: '1px solid #E4E6EB' }}
                          >
                            <ListItemText primary="Click Content" />
                          </ListItemButton>
                        </List>
                      </Collapse>
                    </ListWithBorder>
                    <CustomBox>
                      <Typography>Target</Typography>
                      <Add />
                    </CustomBox>
                    <CustomBox sx={{ color: '#81818E' }}>
                      <Typography>Screen 2</Typography>
                      <Remove />
                    </CustomBox>
                  </Box>
                  <Box
                    sx={{
                      border: '1px solid #E4E6EB',
                      marginTop: '15px',
                      borderRadius: '5px',
                    }}
                  >
                    <CustomBox>
                      <Typography>Trigger</Typography>
                      <Add />
                    </CustomBox>
                    <CustomBox sx={{ borderTop: '1px solid #E4E6EB' }}>
                      <Typography>Target</Typography>
                      <Add />
                    </CustomBox>
                  </Box>
                </PropertyAccordionDetails>
              </PropertyAccordion>
            </RightpanelBox>
          </Grid>
        </Grid>
      </Stack>
    </>
  );
};

export default Wireframe;
