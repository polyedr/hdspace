import React from 'react';
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
  '& .MuiListItem-root': {
    borderTop: '1px solid #E4E6EB',
    borderBottom: '1px solid #E4E6EB',
  },
});

const Wireframe: React.FC<Props> = () => {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

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
            <Box></Box>
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
                    <Box
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <Typography>Trigger</Typography>
                      <Add />
                    </Box>
                    <Box
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <Typography
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <Crop32 /> Button
                      </Typography>
                      <Remove />
                    </Box>
                    <ListWithBorder disablePadding={true}>
                      <ListItemButton onClick={handleClick}>
                        <ListItemText primary="Click" />
                        {open ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                      <Collapse in={open} timeout="auto" unmountOnExit>
                        <List disablePadding>
                          <ListItemButton sx={{ pl: 4 }}>
                            <ListItemText primary="Click Content" />
                          </ListItemButton>
                        </List>
                      </Collapse>
                    </ListWithBorder>
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
