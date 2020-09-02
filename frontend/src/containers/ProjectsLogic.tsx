import React from 'react';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { selectors } from '$redux/project';
import Projects from '../components/Projects/Projects';
import Spinner from '../components/UI/Spinner';

const mapStateToProps = (state: AppReduxState) => ({
  projectListLoader: selectors.selectProjectListLoader(state),
});

type IDashboardProps = ReturnType<typeof mapStateToProps>;

const ProjectsLogic: React.FC<IDashboardProps> = ({ projectListLoader }) => (
  <>
    <Projects />
    <Spinner active={projectListLoader} />
  </>
);

export default connect(mapStateToProps, null)(ProjectsLogic);
