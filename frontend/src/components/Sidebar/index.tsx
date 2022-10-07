import {
  selectCurrentProjectId,
  selectSidebarOpen,
} from '@Redux/project/selectors/base';
import React, { FC, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import { Tabs, Tab } from '@material-ui/core';
import { components, TABS_PMTOOLS } from '@Constants/pmtools/tabsNamesSidebar';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { setSidebarOpen } from '@Redux/project/actions';
import { makeStyles, styled } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    '& > *': {
      '&::-webkit-scrollbar': {
        width: '4px !important',
        background: '#F3F4F6',
      },

      '&::-webkit-scrollbar-thumb': {
        background: '#B0B0BD',
        borderRadius: 4,
      },

      '&::-webkit-scrollbar-track': {
        borderRadius: 4,
      },
    },
  },
});

const TabContent = styled('div')({
  '& > *': {
    '::-webkit-scrollbar': {
      width: '4px !important',
      background: '#F3F4F6',
    },

    '::-webkit-scrollbar-thumb': {
      background: '#B0B0BD',
      borderRadius: 4,
    },

    '::-webkit-scrollbar-track': {
      borderRadius: 4,
    },
  },
});

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      style={{ height: 'calc(100% - 48px)' }}
      {...other}
    >
      {children}
    </div>
  );
}

const SideModule: FC = () => {
  const open = useSelector(selectSidebarOpen);
  const projectId = useSelector(selectCurrentProjectId);
  const dispatch = useDispatch();
  const [selectedTabNumber, setSelectedTabNumber] = useState(0);
  const classes = useStyles();

  const handleSetSidebarOpen = useCallback(() => {
    dispatch(setSidebarOpen(false));
  }, []);

  if (projectId === -1) {
    return <p>Loading... </p>;
  }

  return (
    <SwipeableDrawer
      anchor="right"
      open={open}
      onClose={handleSetSidebarOpen}
      onOpen={() => {}}
      className={classes.root}
    >
      <div
        style={{
          width: '90vw',
          height: '100%',
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={selectedTabNumber}
            onChange={(e, v) => setSelectedTabNumber(v)}
            textColor="primary"
            indicatorColor="primary"
          >
            {Object.values(TABS_PMTOOLS).map((tab) => (
              <Tab
                data-testid={`${tab}-tab`}
                label={tab}
                key={tab}
                title={tab}
              />
            ))}
          </Tabs>
        </Box>

        {Object.values(TABS_PMTOOLS).map((tab, idx) => {
          const Tab = components[tab];
          return (
            <TabContent>
              <TabPanel value={selectedTabNumber} key={tab} index={idx}>
                <Tab />
              </TabPanel>
            </TabContent>
          );
        })}
      </div>
    </SwipeableDrawer>
  );
};

export default SideModule;
