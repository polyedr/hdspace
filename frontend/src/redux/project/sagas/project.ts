/* eslint-disable no-console */

import { SagaIterator } from 'redux-saga';
import { put, call, select, all } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import * as R from 'ramda';
import * as Actions from '../actions';

import { selectors, T } from '..';
import { reqWrapper } from './index';
import { ReturnPromisedType } from '../../../shared/types';
import { addScreenSaga, getScreenSaga } from './screen';
import {
  convertCreatedProjectToRequest,
  convertProjectToPatchRequest,
} from '../../../api/converters/toRequest';
import {
  apiAddProject,
  apiDelProject,
  apiGetProjectList,
  apiGetProject,
  apiSaveProject,
} from '../../../api/project';
import generateFontFace from '../../../utils/generateFontFace';
import { Page } from '../types';
import { apiGetScenarios } from '../../../api/scenario';
import { apiGetElements } from '../../../api/element';
import { apiSaveScreen } from '../../../api/screen';
import { Project } from '../../../api/types';
import { setScreens } from '../actions';
import {
  selectProjectsCurrentPage,
  selectProjectsPageSize,
} from '../selectors';

export function* getProjectListSaga(): SagaIterator {
  yield put(Actions.setProjectListLoader(true));
  const limit: number = yield select(selectProjectsPageSize);
  const currentPage: number = yield select(selectProjectsCurrentPage);
  const offset = currentPage * limit;

  const result = yield call(reqWrapper, apiGetProjectList, {
    params: { limit, offset },
  });

  if (!result) {
    yield put(Actions.setProjectListLoader(false));
    return;
  }

  yield put(Actions.setProjectsData(result));
  // yield put(Actions.setProjectList(result));
  yield put(Actions.setProjectListLoader(false));
}

export function* getProjectSaga(action: ReturnType<typeof Actions.getProject>) {
  const { id, screenID } = action.payload;

  yield put(Actions.setProjectLoader(true));

  const project: Project = yield call(reqWrapper, apiGetProject, { id });
  if (!project) {
    console.error(`Error while fetching project ${id}`);
    return;
  }

  yield put(Actions.setProject(project));

  yield put(Actions.setCurrentProjectId(project.id));

  const screens = yield all(
    project.projectscreen.map((screenId) => getScreenSaga(screenId)),
  );

  yield put(setScreens(screens));

  const finalScreenId = screenID || project.projectscreen[0];

  if (finalScreenId) {
    yield put(Actions.activateScreen(Number(finalScreenId)));

    yield put(push(`/project/${id}/${finalScreenId}`));
  } else {
    yield put(Actions.setCurrentScreenId(-1));
  }

  yield put(Actions.setProjectLoader(false));
}

export function* addProjectSaga({
  payload: { name },
}: ReturnType<typeof Actions.addProject>) {
  const projectData = convertCreatedProjectToRequest(name);
  const project: Project = yield call(reqWrapper, apiAddProject, {
    data: projectData,
  });

  if (!project) {
    // TODO: write communication for such case
    console.error('cannot create project', project);
    return;
  }

  const projects: ReturnType<typeof selectors.selectProjects> = yield select(
    selectors.selectProjects,
  );
  yield put(Actions.setProjectList([...projects, project]));

  yield put(Actions.setIsAddElementsModalOpened(true));

  // eslint-disable-next-line consistent-return
  yield put(Actions.setCurrentProjectId(project.id));

  yield call(addScreenSaga, Actions.addScreen(project.id, 'Screen 1', 0, true));
}

export function* exportProjectSaga() {
  const currentProject: ReturnType<typeof selectors.selectCurrentProject> = yield select(
    selectors.selectCurrentProject,
  );
  const screens: ReturnType<typeof selectors.selectScreens> = yield select(
    selectors.selectScreens,
  );
  const screensIDs = screens
    .sort((a, b) => a.buoyancy - b.buoyancy)
    .map((screen) => screen.id);

  const screensContainers: ReturnPromisedType<
    typeof apiGetScenarios
  >[] = yield all(
    screensIDs.map((screenID) =>
      call(reqWrapper, apiGetScenarios, { screenID }),
    ),
  );

  const elements: ReturnPromisedType<typeof apiGetElements>[] = yield all(
    screensContainers.map((screenContainers) => {
      const containersIDs = screenContainers.map(
        (screenContainer) => screenContainer.id,
      );
      return call(reqWrapper, apiGetElements, {
        scenariosIDs: containersIDs,
      });
    }),
  );

  const elementsWithImages = ((R.flatten(
    elements,
  ) as unknown) as T.IScenarioElement[]).filter(
    (element) => element.parameters.imageURL,
  );

  const imagesResponses: Response[] = yield all(
    elementsWithImages.map((element) =>
      call(fetch, element.parameters.imageURL || ''),
    ),
  );

  const imagesBlobs: Blob[] = yield all(
    imagesResponses.map((imageResponse) => call([imageResponse, 'blob'])),
  );

  const renderElements = elements;
  const zip = new JSZip();

  imagesBlobs.forEach((imageBlob, imageIndex) => {
    const filename = imagesResponses[imageIndex].url.match(
      /([^\\/?]+(?=\\.(?!.*\\.))[^'\\)\\/]*|[^\\/$\\?)']*$)/,
    );
    const elementID = elementsWithImages[imageIndex].id;

    if (filename) {
      renderElements.forEach((screenElements) => {
        const elementToAddImage = screenElements.find(
          (element) => element.id === elementID,
        );
        if (elementToAddImage)
          elementToAddImage.parameters.imageURL = `images/${filename[0]}`;
      });

      zip.file(`images/${filename[0]}`, imageBlob);
    }
  });

  const renderTreeInfo: Page[] = screensContainers.map(
    (screenContainers, index) => {
      const pageScreenID =
        (screenContainers.length && screenContainers[0].screen) || -1;

      return {
        screenInfo: {
          name:
            screens.find((screen) => screen.id === pageScreenID)?.name || '',
          id: pageScreenID,
        },
        renderTree: {
          containers: screenContainers,
          elements: renderElements[index],
        },
      };
    },
  );

  const fontsInfo = R.uniq(
    ((R.flatten(elements) as unknown) as T.IScenarioElement[])
      .filter((element) => element.styles['font-family'])
      .map((element) => {
        const fontFamilyName = element.styles['font-family']
          ?.split(', ')[0]
          .replace(/"/g, '');
        const capitalizedFontFamilyName = fontFamilyName
          ?.split(' ')
          .map((word) => `${word[0].toUpperCase()}${word.substring(1)}`)
          .join('');

        const isBold = element.styles['font-weight'] === 700;
        const isItalic = element.styles['font-style'] === 'italic';

        const fileName = `${capitalizedFontFamilyName}-${isBold ? 'Bold' : ''}${
          isItalic ? 'Italic' : ''
        }${!isBold && !isItalic ? 'Regular' : ''}`;

        const fontFace = generateFontFace(
          fontFamilyName || 'Open Sans',
          fileName || 'OpenSans-Regular',
          element.styles['font-weight'] || 400,
          element.styles['font-style'] || 'normal',
        );

        return { fileName, fontFace };
      }),
  );

  const fontsSVGResponses: Response[] = yield all(
    fontsInfo.map((font) => call(fetch, `/fonts/${font.fileName}.svg`)),
  );
  const fontsTTFResponses: Response[] = yield all(
    fontsInfo.map((font) => call(fetch, `/fonts/${font.fileName}.ttf`)),
  );
  const fontsWOFFResponses: Response[] = yield all(
    fontsInfo.map((font) => call(fetch, `/fonts/${font.fileName}.woff`)),
  );

  const fontsSVGFiles: Blob[] = yield all(
    fontsSVGResponses.map((fontResponse) => call([fontResponse, 'blob'])),
  );
  const fontsTTFFiles: Blob[] = yield all(
    fontsTTFResponses.map((fontResponse) => call([fontResponse, 'blob'])),
  );
  const fontsWOFFFiles: Blob[] = yield all(
    fontsWOFFResponses.map((fontResponse) => call([fontResponse, 'blob'])),
  );

  fontsSVGFiles.forEach((fontFile, index) => {
    zip.file(
      `fonts/${fontsInfo[index]?.fileName || 'OpenSans-Regular'}.svg`,
      fontFile,
    );
  });

  fontsTTFFiles.forEach((fontFile, index) => {
    zip.file(
      `fonts/${fontsInfo[index]?.fileName || 'OpenSans-Regular'}.ttf`,
      fontFile,
    );
  });

  fontsWOFFFiles.forEach((fontFile, index) => {
    zip.file(
      `fonts/${fontsInfo[index]?.fileName || 'OpenSans-Regular'}.woff`,
      fontFile,
    );
  });

  const jsBundleResponse = yield call(fetch, '/export/bundle.js');
  const jsBundleFile = yield call([jsBundleResponse, 'text']);

  const stylesResponse = yield call(fetch, '/export/styles.css');
  const stylesFile = yield call([stylesResponse, 'text']);

  const renderTreeInfoInString = JSON.stringify(renderTreeInfo);

  const fontFaces = fontsInfo
    .map((font) => font.fontFace)
    .reduce((acc, font) => acc + font);

  zip.file(
    'index.html',
    `
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">
      <title>${currentProject.name}</title>
      <link rel="stylesheet" href="styles.css">
      <style>${fontFaces}</style>
    </head>
    <body>
      <div id="root"></div>
      <script>
        window.renderTreeInfo = ${renderTreeInfoInString};
      </script>
      <script src="bundle.js"></script>
    </body>
  </html>
  `,
  );

  zip.file('bundle.js', jsBundleFile);
  zip.file('styles.css', stylesFile);

  zip
    .generateAsync({ type: 'blob' })
    .then((blob) => saveAs(blob, `${currentProject.name}.zip`));
}

export function* delProjectSaga({
  payload: { id },
}: ReturnType<typeof Actions.delProject>): SagaIterator {
  yield call(reqWrapper, apiDelProject, { id });

  const projectList: ReturnType<typeof selectors.selectProjects> = yield select(
    selectors.selectProjects,
  );
  const newProjectList: Project[] = projectList.filter(
    (project) => project.id !== id,
  );

  yield put(Actions.setProjectList(newProjectList));
}

export function* renameProjectSaga({
  payload: { projectID, name },
}: ReturnType<typeof Actions.renameProject>) {
  const project: Project = yield select(selectors.selectProjectById(projectID));

  const updatedProject = yield call(reqWrapper, apiSaveProject, {
    data: { id: projectID, name, projectscreen: project.projectscreen },
  });

  yield put(Actions.setProject(updatedProject));
}

export function* changeScreensOrderSaga(
  action: ReturnType<typeof Actions.changeScreensOrder>,
) {
  const { screens } = action.payload;

  yield put(setScreens(screens));

  yield all(
    screens.map(({ id, buoyancy }) =>
      call(reqWrapper, apiSaveScreen, {
        id,
        data: {
          buoyancy,
        },
      }),
    ),
  );
}

export function* updateProject(newProject: Project) {
  yield put(Actions.setProject(newProject));
  const convertedProject = convertProjectToPatchRequest(newProject);
  yield call(reqWrapper, apiSaveProject, { data: convertedProject });
}

export function* updateProjectSaga(
  action: ReturnType<typeof Actions.updateProject>,
) {
  const { project } = action.payload;

  if (!action.meta) {
    console.error(
      `You have to provide metainformation for action ${action.type}`,
    );
    return;
  }

  const currentProject: ReturnType<typeof selectors.selectCurrentProject> = yield select(
    selectors.selectCurrentProject,
  );

  yield call(updateProject, project);

  const { undo } = action.meta;

  if (!undo) {
    yield put(Actions.setUndoActions(Actions.updateProject(currentProject)));
  }
}
