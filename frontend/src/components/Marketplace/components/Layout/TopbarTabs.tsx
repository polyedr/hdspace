import React from 'react';
import { withRouter } from 'react-router-dom';
import { Tab, Tabs, Container } from '@mui/material';
import styled from 'styled-components';

function TabProps(index) {
  return {
    id: `scrollable-tab-${index}`,
    'aria-controls': `scrollable-tabpanel-${index}`,
  };
}

const CustomContainer = styled(Container)`
  flex-grow: 1;
  background-color: '#FFFFFF';
`;
const CustomTabs = styled(Tabs)`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px 0px 0px 22px;
  gap: 32px;
  height: 20px;
  left: 203px;
  top: 18px;
  margin-left: 3rem;
  & .MuiTab-root {
    min-width: 0;
    text-transform: none;
    font-size: 14px;
    color: #81818e;
  }
  .MuiTab-root.Mui-selected {
    text-transform: none;
    font-size: 14px;
    color: #000000;
  }
`;
const CustomTab = styled(Tab)`
  & .MuiTab-root.MuiButtonBase-root {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    font-style: normal;
    font-weight: 500;
    line-height: 145%;
    font-family: 'Roboto';
    padding: 0px;
    width: 52px;
    height: 20px;
  }
`;
const NavBarItem = {
  '/projects': 0,
  '/team': 1,
  '/marketplace': 2,
};

const TopbarTabs = ({ location, history }) => {
  const [value, setValue] = React.useState(NavBarItem[location.pathname]);
  const handleChange = (newValue) => {
    setValue(newValue);
  };
  const navigateTo = (pathname) => {
    history.push(pathname);
    handleChange(NavBarItem[pathname]);
  };
  return (
    <CustomContainer maxWidth="sx">
      <CustomTabs
        value={value}
        onChange={handleChange}
        aria-label="scrollable tabs example"
        TabIndicatorProps={{ style: { background: '#ffffff' } }}
      >
        <CustomTab
          label="Project"
          {...TabProps(0)}
          onClick={() => navigateTo('/projects')}
        />
        <CustomTab
          label="Team"
          {...TabProps(1)}
          onClick={() => navigateTo('/team')}
        />
        <CustomTab
          label="Marketplace"
          {...TabProps(2)}
          onClick={() => navigateTo('/marketplace')}
        />
      </CustomTabs>
    </CustomContainer>
  );
};

export default withRouter(TopbarTabs);
