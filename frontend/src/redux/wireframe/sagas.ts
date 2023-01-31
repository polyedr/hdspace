import { put, select, takeEvery } from 'redux-saga/effects';
import { updateConnection } from './wireframe';
import { selectCurrentWireframeConnections } from './selectors';
import { WireframeConnection } from '@Redux/types';
import { selectCurrentProject } from '@Redux/project/selectors/base';
import { Project } from '@Src/types';
import { updateProject } from '@Redux/project/actions';

function* updateScreenConnections() {
  const connections: WireframeConnection[] = yield select(
    selectCurrentWireframeConnections,
  );

  const project = yield select(selectCurrentProject);

  const comppleteConnections = connections.filter(
    (connection) =>
      connection.sourceElement &&
      connection.event &&
      connection.destinationScreen,
  );

  const newProject: Project = {
    ...project,
    projectData: {
      ...project.projectData,
      wireframeConnections: comppleteConnections,
    },
  };

  yield put(updateProject(newProject));
}

export function* wireframeSagas() {
  yield takeEvery(updateConnection.toString(), updateScreenConnections);
}
