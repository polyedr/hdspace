import { SagaIterator } from 'redux-saga';
import {
  put, call, select, all,
} from 'redux-saga/effects';
import { push } from 'connected-react-router';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import * as R from 'ramda';

import { apiGetScenarios } from '$api/scenario';
import { apiGetElements } from '$api/element';
import { apiGetScreen, apiSaveScreen } from '$api/screen';
import { ReturnPromisedType } from '$shared/types';
import { AppReduxState } from '$shared/types/app';
import { Page, IProjectScreen } from '$redux/project/types';
import { activateScreenSaga, addScreenSaga } from '$redux/project/sagas/screen';
import * as Actions from '$redux/project/actions';
import { setScreens } from '$redux/project/actions';
import { changePrototypeMode } from '$redux/user/actions';
import {
  apiGetListProject,
  apiAddProject,
  apiDelProject,
  apiGetProject,
  apiSaveProject,
} from '$api/project';
import { Project } from '$api/types';
import { DEFAULT_SCREEN } from '$constants/defaultParams';
import { reqWrapper } from '$redux/project/sagas/index';
import { generateFontFace } from '$utils/generateFontFace';

import { selectors, T } from '../';

export function* getListProjectSaga(): SagaIterator {
  yield put(Actions.setListProjectLoader(true));
  yield put(Actions.getLibraryElements());

  const result = yield call(reqWrapper, apiGetListProject);

  if (!result) {
    yield put(Actions.setListProjectLoader(false));

    return;
  }

  yield put(Actions.setListProject(result));
  yield put(Actions.setListProjectLoader(false));
}

export function* getProjectSaga(action: ReturnType<typeof Actions.getProject>) {
  const { id, screenID } = action.payload;
  const currentProject: ReturnType<typeof selectors.selectCurrentProject> = yield select(selectors.selectCurrentProject);
  const { user: { isPrototypeMode } }: AppReduxState = yield select();

  if (currentProject.id === id) {
    yield put(changePrototypeMode(isPrototypeMode));
  } else {
    yield put(changePrototypeMode(false));
  }

  if (!currentProject || currentProject.id !== id) {
    yield put(Actions.setProjectLoader(true));

    const project: ReturnPromisedType<typeof apiGetProject> = yield call(reqWrapper, apiGetProject, { id });

    if (project) {
      yield put(Actions.setProject(project));
      const projectScreensIDs = project.projectscreen;
      const finalScreenID = screenID && projectScreensIDs.includes(Number(screenID)) ? screenID : projectScreensIDs[0];

      if (finalScreenID) {
        yield call(activateScreenSaga, Actions.activateScreen(id, Number(finalScreenID)));
        yield put(push(`/project/${id}/${finalScreenID}`));

        const screens: IProjectScreen[] = yield all(projectScreensIDs.map(screenID => call(reqWrapper, apiGetScreen, { id: screenID })));
        yield put(setScreens(screens));
      } else {
        yield put(Actions.setScreen(DEFAULT_SCREEN));
      }
    } else {
      // msg Error
    }

    yield put(Actions.setProjectLoader(false));
  }
}

export function* addProject(action: ReturnType<typeof Actions.addProject>) {
  const { id: projectID } = yield call(addProjectSaga, action);
  yield call(addScreenSaga, Actions.addScreen(projectID, 'Screen 1', 0));
  yield put(push(`/project/${projectID}`));
}

export function* exportProjectSaga() {
  const currentProject: ReturnType<typeof selectors.selectCurrentProject> = yield select(selectors.selectCurrentProject);
  const screens: ReturnType<typeof selectors.selectScreens> = yield select(selectors.selectScreens);
  const screensIDs = screens.sort((a, b) => (a.buoyancy - b.buoyancy)).map(screen => screen.id);

  const screensContainers: ReturnPromisedType<typeof apiGetScenarios>[] = yield all(screensIDs.map(screenID =>
    call(reqWrapper, apiGetScenarios, { screenID }),
  ));

  const elements: ReturnPromisedType<typeof apiGetElements>[] = yield all(screensContainers.map(screenContainers => {
    const containersIDs = screenContainers.map(screenContainer => screenContainer.id);
    return call(reqWrapper, apiGetElements, { scenariosIDs: containersIDs });
  }));

  const elementsWithImages = (R.flatten(elements) as unknown as T.IScenarioElement[]).filter(element => element.parameters.imageURL);

  const imagesResponses: Response[] = yield all(elementsWithImages.map(element => call(fetch, element.parameters.imageURL || '')));

  const imagesBlobs: Blob[] = yield all(imagesResponses.map(imageResponse => call([imageResponse, 'blob'])));

  const renderElements = elements;
  const zip = new JSZip();

  imagesBlobs.forEach((imageBlob, imageIndex) => {
    const filename = imagesResponses[imageIndex].url.match(/([^\\/?]+(?=\\.(?!.*\\.))[^'\\)\\/]*|[^\\/$\\?)']*$)/);
    const elementID = elementsWithImages[imageIndex].id;

    if (filename) {
      renderElements.forEach(screenElements => {
        const elementToAddImage = screenElements.find(element => element.id === elementID);
        if (elementToAddImage) elementToAddImage.parameters.imageURL = `images/${filename[0]}`;
      })

      zip.file(`images/${filename[0]}`, imageBlob);
    }
  });

  const renderTreeInfo: Page[] = screensContainers.map((screenContainers, index) => {
    const pageScreenID = screenContainers.length && screenContainers[0].screen || -1;

    return {
      screenInfo: {
        name: screens.find(screen => screen.id === pageScreenID)?.name || '',
        id: pageScreenID,
      },
      renderTree: {
        containers: screenContainers,
        elements: renderElements[index],
      },
    };
  });

  const fontsInfo = R.uniq((R.flatten(elements) as unknown as T.IScenarioElement[])
    .filter(element => element.styles['font-family'])
    .map(element => {
      const fontFamilyName = element.styles['font-family']?.split(', ')[0].replace(/"/g,"");
      const capitalizedFontFamilyName = fontFamilyName?.split(' ').map(word => `${word[0].toUpperCase()}${word.substring(1)}`).join('');
      
      const isBold = element.styles['font-weight'] === 700;
      const isItalic = element.styles['font-style'] === 'italic';

      const fileName = `${capitalizedFontFamilyName}-${isBold ? "Bold" : ""}${isItalic ? "Italic" : ""}${!isBold && !isItalic ? "Regular" : ""}`;

      const fontFace = generateFontFace(
        fontFamilyName || 'Open Sans',
        fileName || 'OpenSans-Regular',
        element.styles['font-weight'] || 400,
        element.styles['font-style'] || 'normal'
      );

      return { fileName, fontFace };
  }));

  const fontsSVGResponses: Response[] = yield all(fontsInfo.map(font => call(fetch, `/fonts/${font.fileName}.svg`)));
  const fontsTTFResponses: Response[] = yield all(fontsInfo.map(font => call(fetch, `/fonts/${font.fileName}.ttf`)));
  const fontsWOFFResponses: Response[] = yield all(fontsInfo.map(font => call(fetch, `/fonts/${font.fileName}.woff`)));

  const fontsSVGFiles: Blob[] = yield all(fontsSVGResponses.map(fontResponse => call([fontResponse, 'blob'])));
  const fontsTTFFiles: Blob[] = yield all(fontsTTFResponses.map(fontResponse => call([fontResponse, 'blob'])));
  const fontsWOFFFiles: Blob[] = yield all(fontsWOFFResponses.map(fontResponse => call([fontResponse, 'blob'])));

  fontsSVGFiles.forEach((fontFile, index) => {
    zip.file(`fonts/${fontsInfo[index]?.fileName || "OpenSans-Regular"}.svg`, fontFile);
  });

  fontsTTFFiles.forEach((fontFile, index) => {
    zip.file(`fonts/${fontsInfo[index]?.fileName || "OpenSans-Regular"}.ttf`, fontFile);
  });

  fontsWOFFFiles.forEach((fontFile, index) => {
    zip.file(`fonts/${fontsInfo[index]?.fileName || "OpenSans-Regular"}.woff`, fontFile);
  });

  const jsBundleResponse = yield call(fetch, '/export/bundle.js');
  const jsBundleFile = yield call([jsBundleResponse, "text"]);

  const stylesResponse = yield call(fetch, '/export/styles.css');
  const stylesFile = yield call([stylesResponse, "text"]);

  const renderTreeInfoInString = JSON.stringify(renderTreeInfo);

  const fontFaces = fontsInfo.map(font => font.fontFace).reduce((acc, font) => acc + font);

  zip.file('index.html', 
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
  `);

  zip.file('bundle.js', jsBundleFile);
  zip.file('styles.css', stylesFile);

  zip.generateAsync({ type: 'blob' }).then(blob => saveAs(blob, `${currentProject.name}.zip`));
}


export function* addProjectSaga({ payload: { name } }: ReturnType<typeof Actions.addProject>) {
  let project: Project = yield call(reqWrapper, apiAddProject, { data: { name, status: 'pending', projectscreen: [] } });
  
  if (!project) { // TODO: write communication for such case
    console.error('cannot create project', project);
    return;
  }

  const newName = `${project.name}-${project.id}`;

  project = yield call(reqWrapper, apiSaveProject, { data: {...project, name: newName} });

  if (!project) {
    console.error('Cannot rename project', name);
    return;
  }

  const projects: ReturnType<typeof selectors.selectProjects> = yield select(selectors.selectProjects);
  yield put(Actions.setListProject([...projects, project]));

  return project;
}

export function* delProjectSaga({ payload: { id } }: ReturnType<typeof Actions.delProject>): SagaIterator {
  yield call(reqWrapper, apiDelProject, { id });

  const listProject: ReturnType<typeof selectors.selectProjects> = yield select(selectors.selectProjects);
  const newListProject: Project[] = listProject.filter(project => project.id !== id);

  yield put(Actions.setListProject(newListProject));
}

export function* renameProjectSaga(
  { payload: { projectID, name } }: ReturnType<typeof Actions.renameProject>,
): SagaIterator {
  const listProject: ReturnType<typeof selectors.selectProjects> = yield select(selectors.selectProjects);
  const currentProject: ReturnType<typeof selectors.selectCurrentProject> = yield select(selectors.selectCurrentProject);

  const currProject = listProject.find(project => project.id === projectID);

  if (!currProject) return;

  const data = { ...currProject, name: name };

  const updatedProject = yield call(reqWrapper, apiSaveProject, { data });

  const newListProject = listProject.map((project) => {
    if (project.id === projectID) {
      return updatedProject;
    }

    return project;
  });

  yield put(Actions.setListProject(newListProject));

  if (currentProject.id === projectID) {
    yield put(Actions.setProject(updatedProject));
  }
}

export function* changeScreensOrderSaga(action: ReturnType<typeof Actions.changeScreensOrder>) {
  const { screens } = action.payload;

  yield put(setScreens(screens));

  yield all(screens.map(screen => call(reqWrapper, apiSaveScreen, {
    id: screen.id,
    data: screen,
  })));
}
