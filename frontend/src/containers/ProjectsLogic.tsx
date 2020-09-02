import React from 'react';
import { connect } from 'react-redux';

import Projects from '../components/Projects/Projects';
import Spinner from '../components/UI/Spinner';
import { AppReduxState } from '../shared/types/app';
import { selectProjectListLoader } from '../redux/project/selectors';

const mapStateToProps = (state: AppReduxState) => ({
  projectListLoader: selectProjectListLoader(state),
});

type IDashboardProps = ReturnType<typeof mapStateToProps>;

const ProjectsLogic: React.FC<IDashboardProps> = ({ projectListLoader }) => (
  <>
    <Projects />
    <Spinner active={projectListLoader} />
  </>
);

export default connect(mapStateToProps, null)(ProjectsLogic);
