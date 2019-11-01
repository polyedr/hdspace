import React from 'react';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';

import * as Actions from '$redux/project/actions';
import { Projects } from '$components/Projects';
import { Spinner } from '$components/UI/Spinner';

const mapStateToProps = ({ project: { listProject, listProjectLoader } }) => ({
  listProject,
  listProjectLoader,
});

const mapDispatchToProps = {
  addProject: Actions.addProject,
  delProject: Actions.delProject,
  renameProject: Actions.renameProject,
};

type IDashboardProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const ProjectsLogic: React.FunctionComponent<IDashboardProps> = ({
  listProject,
  listProjectLoader,

  addProject,
  delProject,
  renameProject,
}) => (
  <React.Fragment>
    <Projects
      listProject={listProject}
      addProject={addProject}
      delProject={delProject}
      renameProject={renameProject}
    />
    <Spinner active={listProjectLoader} />
  </React.Fragment>
);

export default connect(mapStateToProps, mapDispatchToProps)(hot(module)(ProjectsLogic));
