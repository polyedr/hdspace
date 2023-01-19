import React from 'react';
import {
  styled,
  Typography,
  Box,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
} from '@mui/material';
import {
  Remove,
  Crop32,
  ExpandMore,
  ExpandLess,
  Add,
} from '@mui/icons-material';
import {
  PropertyAccordion,
  PropertyAccordianSummary,
  PropertyAccordionDetails,
} from '../../styledComponents';
import { useSelector } from 'react-redux';
import {
  selectCurrentWireframeElement,
  selectCurrentWireframeScreen,
} from '@Redux/wireframe/selectors';

const RightpanelBox = styled(Box)({
  backgroundColor: 'white',
  height: '100%',
  borderLeft: '1px solid #E4E6EB',
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

const RightSidebar = () => {
  const [open, setOpen] = React.useState(false);

  const selectedElementId = useSelector(selectCurrentWireframeElement);
  const selectedScreenId = useSelector(selectCurrentWireframeScreen);

  const handleClick = () => {
    setOpen(!open);
  };

  if (!selectedElementId) {
    return null;
  }

  return (
    <RightpanelBox>
      <PropertyAccordion defaultExpanded>
        <PropertyAccordianSummary expandIcon={<ExpandMore />}>
          connect
        </PropertyAccordianSummary>
        <PropertyAccordionDetails>
          <Box sx={{ border: '1px solid #E4E6EB', borderRadius: '5px' }}>
            <CustomBox>
              <Typography>Trigger</Typography>
              <Add />
            </CustomBox>
            <CustomBox sx={{ color: '#81818E' }}>
              <Typography sx={{ display: 'flex', alignItems: 'center' }}>
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
  );
};

export default RightSidebar;
