import React from 'react';
import {
  styled,
  Box,
  Stack,
  List,
  Typography,
  IconButton,
  Link,
  Collapse,
  ListItemButton,
  ListItemText,
} from '@mui/material';

import {
  FolderOutlined,
  VisibilityOutlined,
  Add,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';

import {
  PropertyAccordion,
  PropertyAccordianSummary,
  PropertyAccordionDetails,
} from '@/components/styledComponents';

const LeftpanelBox = styled(Box)({
  backgroundColor: 'white',
  height: '100%',
  borderRight: '1px solid #E4E6EB',
  paddingTop: 20,
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

const LeftSidebar = () => {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
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
  );
};

export default LeftSidebar;
