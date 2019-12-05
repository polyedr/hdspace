import React from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import 'antd/dist/antd.css';

import { AppReduxState } from '$shared/types/app';
import * as ActionsUser from '$redux/user/actions';
import * as ActionsProject from '$redux/project/actions';
import { selectors } from '$redux/project';
import { history } from '$redux/store';

import { Routes } from './Routes';

const mapStateToProps = (state: AppReduxState) => ({
  isLPanelMinimized: state.user.isLPanelMinimized,
  listProject: selectors.selectProjects(state),
  pathname: state.router.location.pathname,
});

const mapDispatchToProps = {
  changeMinLPanel: ActionsUser.changeMinLPanel,
  getListProject: ActionsProject.getListProject,
};

export type IAppProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const Component: React.FunctionComponent<IAppProps> = () => {
  return (
    <ConnectedRouter history={history}>
      <Routes />
    </ConnectedRouter>
  );
};

export const App = connect(mapStateToProps, mapDispatchToProps)(hot(module)(Component));
