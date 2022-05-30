import React from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Tab, Tabs, Container } from '@material-ui/core';

function a11yProps(index) {
  return {
    id: `scrollable-tab-${index}`,
    'aria-controls': `scrollable-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  tabList: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: '0px 0px 0px 22px',
    gap: '32px',
    height: '20px',
    left: '203px',
    top: '18px',
    '& .MuiTab-root': {
      minWidth: 0,
    },
  },
  tabs: {
    '& .MuiTab-wrapper': {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-start',
      textTransform: 'none',
      fontStyle: 'normal',
      fontWeight: 500,
      lineHeight: '145%',
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.fontSize,
      padding: '0px',
      width: '52px',
      height: '20px',
    },
  },
}));

const NavBarItem = {
  '/projects': 0,
  '/team': 1,
  '/marketplace': 2,
};

const TopbarTabs = ({ location, history }) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(NavBarItem[location.pathname]);

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const navigateTo = (pathname) => {
    history.push(pathname);
    handleChange(NavBarItem[pathname]);
  };

  return (
    <Container maxWidth="md" className={classes.root}>
      <Tabs
        value={value}
        onChange={handleChange}
        className={classes.tabList}
        aria-label="scrollable tabs example"
        TabIndicatorProps={{ style: { background: '#ffffff' } }}
      >
        <Tab
          className={classes.tabs}
          label="Project"
          {...a11yProps(0)}
          onClick={() => navigateTo('/projects')}
        />
        <Tab
          className={classes.tabs}
          label="Team"
          {...a11yProps(1)}
          onClick={() => navigateTo('/team')}
        />
        <Tab
          className={classes.tabs}
          label="Marketplace"
          {...a11yProps(2)}
          onClick={() => navigateTo('/marketplace')}
        />
      </Tabs>
    </Container>
  );
};

export default withRouter(TopbarTabs);
