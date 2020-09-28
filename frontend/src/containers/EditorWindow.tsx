import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Profile from '../components/User/Profile';
import EditorLogic from './EditorLogic';
import { PATH_NAMES } from '../constants/pathNames';
import Layout from '../components/Layout';
import Projects from '../components/Projects/Projects';

// const styles = require('../styles/global.scss');

const EditorWindow: React.FC = () => {
  return (
    <Layout>
      <Switch>
        <Route path={PATH_NAMES.projects} component={Projects} />

        <Route path="/project/:projectId/:screenId?" component={EditorLogic} />

        <Route path={PATH_NAMES.profile} component={Profile} />

        <Redirect from="/*" to={PATH_NAMES.projects} />
      </Switch>
    </Layout>
  );
};

export default EditorWindow;
