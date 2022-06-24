import React, { memo } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { selectVIAModeEnabled } from '@Redux/project/selectors/via';
import { useSelector } from 'react-redux';
import AssetsSection from '@Src/components/LeftPanel/Assets/index';
import Navigator from '../Navigator';
import VIANavigator from '../VIANavigator';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ display: value === index ? 'block' : 'none' }}
      {...other}
    >
      <Box
        sx={{
          p: '16px',
          backgroundColor: '#ffffff',
          minHeight: '424px',
          maxHeight: '424px',
        }}
      >
        {children}
      </Box>
    </div>
  );
}

function panelProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const LeftTabPanel = () => {
  const [value, setValue] = React.useState(0);
  const viaMode = useSelector(selectVIAModeEnabled);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          backgroundColor: '#ffffff',
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          TabIndicatorProps={{ style: { background: '#5064FF' } }}
          sx={{
            textTransform: 'capitalize',
            '& .MuiTab-root': {
              color: '#81818E',
              fontWeight: '600',
              fontStyle: 'Roboto',
            },
            '& .MuiTab-root.Mui-selected': {
              color: '#000000',
            },
          }}
        >
          <Tab
            label="Layers"
            {...panelProps(0)}
            sx={{
              textTransform: 'capitalize',
              backgroundColor: '#ffffff',
            }}
          />
          <Tab
            label="Assets"
            {...panelProps(1)}
            sx={{ textTransform: 'capitalize', backgroundColor: '#ffffff' }}
          />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        {viaMode ? <VIANavigator /> : <Navigator />}
      </TabPanel>
      <TabPanel value={value} index={1}>
        <AssetsSection />
      </TabPanel>
    </Box>
  );
};

export default memo(LeftTabPanel);
