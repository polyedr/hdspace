import {
  takeLatest,
  takeEvery,
  put,
  call,
  select,
  fork,
} from 'redux-saga/effects';
import {
  removeProjectStyles,
  updateDefaultStyles,
  updateProjectClasses,
} from '@Utils/ProjectClassesHelper';
import {
  ItemToCopyInfo,
  LibraryElement,
  Normalized,
  StateElement,
  UserProjectPermission,
  ScreenData,
} from '@Src/types';
import {
  activateScreenSaga,
  createScreenSaga,
  changeScreensOrderSaga,
  deleteScreenSaga,
  editScreenNameAndDataSaga,
  restoreScreenSaga,
  updateScreenImageSaga,
  setEditableScreenSaga,
  convertFreeCanvasSaga,
  clearEditableScreenSaga,
} from '@Redux/project/sagas/screen';
import {
  getAllUsersProjectPermissionsSaga,
  getMyPermissionsForProjectSaga,
  getUsersSaga,
  updateUserPermissionsForProjectSaga,
} from '@Redux/permissions/sagas';
import withRequiredPermissions from '@Redux/permissions/wrappers/withRequiredPermissions';
import { compose } from 'redux';
import logger from 'loglevel';
import nnSaga from './nn';
import { updateUISettingsParametersSaga } from '../../user/sagas';
import {
  moveElementSaga,
  removeElementStylesSaga,
  updateElementStylesSaga,
  replaceElementStylesSaga,
  copyElementStylesSaga,
  addElementClassNameSaga,
  removeElementClassNameSaga,
  updateElementImageSaga,
  updateElementParametersSaga,
  loadCustomElementsSaga,
  toggleSelectedElementSaga,
  setActiveElementSaga,
  removeMultipleElementsStylesSaga,
  updateMultipleElementsStylesSaga,
  createElementsGroupSaga,
  updateMultipleElementsParametersSaga,
  duplicateElements,
  uploadElementImageByUrlSaga,
  unbindGroupElementStylesSaga,
  replaceElementParametersSaga,
  processDropTargetParamsSaga,
  processDropElementSaga,
  replaceMultipleElementsStylesSaga,
  setEnabledPseudoClassSaga,
} from './element';
import {
  addChildrenToElementSaga,
  addChildToElementSaga,
  createChildElementsSaga,
  createLibraryElementsSaga,
  redoWrapIntoContainerSaga,
  restoreElementChildrenSaga,
  restoreElementSaga,
  softDeleteSaga,
  softDeleteMultipleSaga,
  unwrapFromContainerSaga,
  updateElementSaga,
  wrapIntoContainerSaga,
  deleteElementSaga,
  createGroupChildrenSaga,
  createElementsSaga,
} from './scenario';
import {
  createProjectSaga,
  deleteProjectSaga,
  getProjectListSaga,
  getProjectSaga,
  updateNameAndTagsProjectSaga,
  updateLayoutProjectSaga,
  searchProjectsSaga,
  updateCurrentUIFrameworkSaga,
  updateCurrentUIFrameworkVariablesSaga,
  resetCurrentUIFrameworkVariablesSaga,
  updateProjectSaga,
  getSharedProjectSaga,
} from './project';
import TYPES from '../../actionTypes';
import { projectUpdateHelperSaga } from './shared';
import { enqueueSnackbar } from '../../notification/actions';
import * as Actions from '../actions';
import { selectCurrentProject } from '../selectors/base';
import {
  selectActiveElement,
  selectActiveElementId,
  selectAllElements,
  selectElementAsTree,
  selectItemToCopyInfo,
  selectScreenRootElement,
  selectScreen,
} from '../selectors/element';
import { selectCurrentScreen } from '../selectors/screen';
import {
  loadAssetsSaga,
  loadAssetListsSaga,
  uploadAssetSaga,
  addNewAssetListSaga,
  uploadElementAssetSaga,
  removeAssetListSaga,
  removeAssetSaga,
  restoreAssetSaga,
  editIcoScreenSaga,
  generateImagePaletteSaga,
} from './asset';
import {
  checkRobotsFileFromUrlSaga,
  importHtmlSaga,
  importHtmlCheckSaga,
} from './import';
import {
  executeRedoActionsSaga,
  executeUndoActionsSaga,
  addHistoryActionsSaga,
} from './control';
import withActionsHistory from '../wrappers/withActionsHistory';
import viaSaga from './via';

const removeSharedStylesSaga = compose(
  withRequiredPermissions(
    UserProjectPermission.VIEW_PROJECT,
    UserProjectPermission.CHANGE_PROJECT,
  ),
  withActionsHistory,
)(function* (action: ReturnType<typeof Actions.removeSharedStyles>) {
  const { className, cssPropertiesNames } = action.payload;

  if (!action.meta) {
    logger.error(
      `You have to provide metainformation for action ${action.type}`,
    );
    return;
  }

  const currentProject: ReturnType<typeof selectCurrentProject> = yield select(
    selectCurrentProject,
  );
  const newProject = removeProjectStyles(
    currentProject,
    className,
    cssPropertiesNames,
  );

  yield call(projectUpdateHelperSaga, newProject);

  if (!action.meta.useHistory) {
    yield put(
      Actions.addUndoActions(
        Actions.updateProject(currentProject, { ...action.meta }),
      ),
    );
  }

  const state: Normalized<StateElement> = yield select(selectAllElements);

  yield put(Actions.updateElementsTree(state, { ...action.meta }));
});

const updateDefaultStylesSaga = compose(
  withRequiredPermissions(
    UserProjectPermission.VIEW_PROJECT,
    UserProjectPermission.CHANGE_PROJECT,
  ),
  withActionsHistory,
)(function* (action: ReturnType<typeof Actions.updateDefaultStyles>) {
  const { classNames, styles, controlKey } = action.payload;
  if (!action.meta) {
    logger.error(
      `You have to provide meta information for action ${action.type}`,
    );
  }

  const currentProject: ReturnType<typeof selectCurrentProject> = yield select(
    selectCurrentProject,
  );

  const newProject = updateDefaultStyles(
    currentProject,
    classNames,
    styles,
    controlKey,
  );

  yield call(projectUpdateHelperSaga, newProject);

  // @ts-ignore
  if (!action.meta.useHistory) {
    yield put(
      Actions.addUndoActions(
        Actions.updateProject(currentProject, { ...action.meta }),
      ),
    );
  }

  const state: Normalized<StateElement> = yield select(selectAllElements);

  // @ts-ignore
  yield put(Actions.updateElementsTree(state, { ...action.meta }));
});

const updateSharedStylesSaga = compose(
  withRequiredPermissions(
    UserProjectPermission.VIEW_PROJECT,
    UserProjectPermission.CHANGE_PROJECT,
  ),
  withActionsHistory,
)(function* (action: ReturnType<typeof Actions.updateSharedStyles>) {
  const { className, styles } = action.payload;

  if (!action.meta) {
    logger.error(
      `You have to provide metainformation for action ${action.type}`,
    );
    return;
  }

  const currentProject: ReturnType<typeof selectCurrentProject> = yield select(
    selectCurrentProject,
  );
  const newProject = updateProjectClasses(currentProject, className, styles);

  yield call(projectUpdateHelperSaga, newProject);

  if (!action.meta.useHistory) {
    yield put(
      Actions.addUndoActions(
        Actions.updateProject(currentProject, { ...action.meta }),
      ),
    );
  }

  const state: Normalized<StateElement> = yield select(selectAllElements);

  yield put(Actions.updateElementsTree(state, { ...action.meta }));
});

const copyActiveElementSaga = withRequiredPermissions(
  UserProjectPermission.VIEW_PROJECT,
  UserProjectPermission.CHANGE_PROJECT,
)(function* () {
  try {
    const { id: activeItemID, name }: StateElement = yield select(
      selectActiveElement,
    );
    const currentScreen: ReturnType<typeof selectCurrentScreen> = yield select(
      selectCurrentScreen,
    );
    if (activeItemID !== 'none') {
      yield put(Actions.setElementToCopy(activeItemID, currentScreen.id));
    }
    yield put(
      enqueueSnackbar({
        message: `Copied element "${name}"`,
        options: { variant: 'success' },
      }),
    );
  } catch (e) {
    if (e instanceof Error) {
      yield put(
        enqueueSnackbar(
          { message: e.message, options: { variant: 'error' } },
          e,
        ),
      );
    }
  }
});

const duplicateScreenSaga = withRequiredPermissions(
  UserProjectPermission.VIEW_PROJECT,
  UserProjectPermission.CHANGE_PROJECT,
)(function* (action: ReturnType<typeof Actions.duplicateScreen>) {
  try {
    const { name, screenID } = action.payload;

    const sourceRoot: LibraryElement<'root'> = yield select(
      selectScreenRootElement(screenID),
    );
    const screenData: ScreenData = yield select(selectScreen(screenID));
    const sourceCurrentScreen: ReturnType<typeof selectCurrentScreen> =
      yield select(selectCurrentScreen);
    const duplicatedItems = sourceRoot.children.map((child) => ({
      id: child.id,
      screenID: sourceCurrentScreen.id,
    }));
    const currentProject: ReturnType<typeof selectCurrentProject> =
      yield select(selectCurrentProject);
    const projectID = currentProject.id;
    const screensNumber = currentProject.projectscreen.length;
    const screen = yield call(
      createScreenSaga,
      Actions.createScreen({
        projectID,
        name,
        buoyancy: screensNumber,
        freeCanvas: screenData.freeCanvas,
        styles: sourceRoot.styles,
      }),
    );
    if (!screen) {
      throw new Error('Failed to create screen');
    }

    yield put(Actions.setScreenLoader(true));

    const targetRoot: LibraryElement<'root'> = yield select(
      selectScreenRootElement(screen.id),
    );
    const targetRootID = targetRoot.id;
    targetRoot.styles = sourceRoot.styles;
    yield put(Actions.setActiveElement(targetRootID));

    if (duplicatedItems.length) {
      yield call(
        duplicateElements,
        { itemsToCopyInfo: duplicatedItems, targetParent: targetRoot },
        {
          screenId: screen.id,
          useHistory: true,
        },
      );
    }

    yield put(Actions.setScreenLoader(false));
  } catch (e) {
    if (e instanceof Error) {
      yield put(
        enqueueSnackbar(
          { message: e.message, options: { variant: 'error' } },
          e,
        ),
      );
    }
  }
});

const pasteCopiedElementSaga = compose(
  withRequiredPermissions(
    UserProjectPermission.VIEW_PROJECT,
    UserProjectPermission.CHANGE_PROJECT,
  ),
  withActionsHistory,
)(function* ({ type, meta }: ReturnType<typeof Actions.pasteCopiedElement>) {
  try {
    if (!meta) {
      logger.error(`You have to provide metainformation for action ${type}`);
      return;
    }
    const { screenId, useHistory } = meta;

    const activeElementId: string = yield select(selectActiveElementId);

    const activeElement: LibraryElement<any> = yield select(
      selectElementAsTree(activeElementId),
    );

    const itemToCopyInfo: ItemToCopyInfo | null = yield select(
      selectItemToCopyInfo,
    );

    if (!itemToCopyInfo) {
      yield put(
        enqueueSnackbar({
          message: 'Nothing to paste',
          options: { variant: 'warning' },
        }),
      );
      return;
    }

    if (activeElement.type !== 'none') {
      const result = yield call(
        duplicateElements,
        { itemsToCopyInfo: [itemToCopyInfo], targetParent: activeElement },
        {
          screenId,
          useHistory,
        },
      );
      if (result) {
        yield put(
          enqueueSnackbar({
            message: 'Element pasted',
            options: { variant: 'success' },
          }),
        );
      }
    }
  } catch (e) {
    if (e instanceof Error) {
      yield put(
        enqueueSnackbar(
          { message: e.message, options: { variant: 'error' } },
          e,
        ),
      );
    }
  }
});

export default function* projectSaga() {
  yield takeLatest(TYPES.LOAD_PROJECTS, getProjectListSaga);

  yield takeLatest(TYPES.CREATE_PROJECT, createProjectSaga);
  yield takeLatest(TYPES.DELETE_PROJECT, deleteProjectSaga);
  yield takeLatest(TYPES.UPDATE_PROJECT, updateProjectSaga);
  yield takeLatest(TYPES.GET_PROJECT, getProjectSaga);
  yield takeLatest(TYPES.CHANGE_SCREENS_ORDER, changeScreensOrderSaga);
  yield takeLatest(
    TYPES.UPDATE_NAME_AND_TAGS_PROJECT,
    updateNameAndTagsProjectSaga,
  );
  yield takeLatest(TYPES.UPDATE_LAYOUT_PROJECT, updateLayoutProjectSaga);
  yield takeLatest(TYPES.SEARCH_PROJECTS, searchProjectsSaga);
  yield takeLatest(TYPES.GET_SHARED_PROJECT, getSharedProjectSaga);
  yield takeLatest(TYPES.ACTIVATE_SCREEN, activateScreenSaga);
  yield takeLatest(TYPES.CREATE_SCREEN, createScreenSaga);
  yield takeEvery(TYPES.DUPLICATE_SCREEN, duplicateScreenSaga);
  yield takeLatest(TYPES.UPDATE_SCREEN_IMAGE, updateScreenImageSaga);
  yield takeLatest(TYPES.DELETE_SCREEN, deleteScreenSaga);
  yield takeEvery(TYPES.RESTORE_SCREEN, restoreScreenSaga);
  yield takeLatest(TYPES.EDIT_SCREEN_NAME_AND_DATA, editScreenNameAndDataSaga);
  yield takeEvery(TYPES.MOVE_ELEMENT, moveElementSaga);

  yield takeLatest(TYPES.UPDATE_DEFAULT_STYLES, updateDefaultStylesSaga);
  yield takeLatest(TYPES.REMOVE_SHARED_STYLES, removeSharedStylesSaga);
  yield takeLatest(TYPES.UPDATE_SHARED_STYLES, updateSharedStylesSaga);
  yield takeLatest(TYPES.REMOVE_ELEMENT_STYLES, removeElementStylesSaga);
  yield takeLatest(TYPES.UPDATE_ELEMENT_STYLES, updateElementStylesSaga);
  yield takeLatest(
    TYPES.REMOVE_MULTIPLE_ELEMENTS_STYLES,
    removeMultipleElementsStylesSaga,
  );
  yield takeLatest(
    TYPES.UPDATE_MULTIPLE_ELEMENTS_STYLES,
    updateMultipleElementsStylesSaga,
  );
  yield takeLatest(
    TYPES.REPLACE_MULTIPLE_ELEMENTS_STYLES,
    replaceMultipleElementsStylesSaga,
  );
  yield takeLatest(TYPES.REPLACE_ELEMENT_STYLES, replaceElementStylesSaga);
  yield takeLatest(TYPES.COPY_ELEMENT_STYLES, copyElementStylesSaga);
  yield takeLatest(TYPES.ADD_ELEMENT_CLASSNAME, addElementClassNameSaga);
  yield takeLatest(TYPES.REMOVE_ELEMENT_CLASSNAME, removeElementClassNameSaga);
  yield takeEvery(TYPES.UPDATE_ELEMENT_IMAGE, updateElementImageSaga);
  yield takeEvery(TYPES.SET_ACTIVE_ELEMENT_SAGA, setActiveElementSaga);

  yield takeEvery(TYPES.UPDATE_ELEMENT_PARAMETERS, updateElementParametersSaga);
  yield takeEvery(
    TYPES.UPDATE_MULTIPLE_ELEMENTS_PARAMETERS,
    updateMultipleElementsParametersSaga,
  );
  yield takeEvery(
    TYPES.REPLACE_ELEMENT_PARAMETERS,
    replaceElementParametersSaga,
  );

  yield takeEvery(TYPES.CREATE_ELEMENTS, createElementsSaga);
  yield takeEvery(TYPES.CREATE_CHILD_ELEMENTS, createChildElementsSaga);
  yield takeEvery(TYPES.CREATE_LIBRARY_ELEMENTS, createLibraryElementsSaga);
  yield takeEvery(TYPES.CREATE_GROUP_CHILDREN, createGroupChildrenSaga);

  yield takeEvery(TYPES.ADD_CHILD_TO_ELEMENT, addChildToElementSaga);
  yield takeEvery(TYPES.ADD_CHILDREN_TO_ELEMENT, addChildrenToElementSaga);
  yield takeEvery(TYPES.WRAP_INTO_CONTAINER, wrapIntoContainerSaga);

  yield takeEvery(TYPES.DELETE_ELEMENT, deleteElementSaga);
  yield takeEvery(TYPES.SOFT_DELETE_ELEMENT, softDeleteSaga);
  yield takeEvery(TYPES.SOFT_DELETE_MULTIPLE_ELEMENTS, softDeleteMultipleSaga);
  yield takeEvery(TYPES.RESTORE_ELEMENT_CHILDREN, restoreElementChildrenSaga);
  yield takeEvery(TYPES.RESTORE_ELEMENT, restoreElementSaga);

  yield takeLatest(TYPES.COPY_ACTIVE_ELEMENT, copyActiveElementSaga);
  yield takeEvery(TYPES.PASTE_COPIED_ELEMENT, pasteCopiedElementSaga);

  yield takeEvery(TYPES.CONVERT_FREE_CANVAS, convertFreeCanvasSaga);

  // history actions
  yield takeEvery(TYPES.ADD_HISTORY_ACTIONS, addHistoryActionsSaga);
  yield takeEvery(TYPES.EXECUTE_UNDO_ACTIONS, executeUndoActionsSaga);
  yield takeEvery(TYPES.EXECUTE_REDO_ACTIONS, executeRedoActionsSaga);

  // /history actions
  yield takeEvery(TYPES.UNWRAP_FROM_CONTAINER, unwrapFromContainerSaga);
  yield takeEvery(TYPES.REDO_WRAP_INTO_CONTAINER, redoWrapIntoContainerSaga);
  yield takeEvery(TYPES.UPDATE_ELEMENT, updateElementSaga);
  yield takeLatest(TYPES.LOAD_CUSTOM_ELEMENTS, loadCustomElementsSaga);

  yield takeEvery(TYPES.IMPORT_HTML, importHtmlSaga);
  yield takeEvery(TYPES.IMPORT_HTML_CHECK, importHtmlCheckSaga);
  yield takeEvery(TYPES.UPLOAD_URL_CHECK_ROBOTS, checkRobotsFileFromUrlSaga);

  yield takeEvery(TYPES.LOAD_ASSET_LISTS, loadAssetListsSaga);
  yield takeEvery(TYPES.LOAD_ASSETS, loadAssetsSaga);
  yield takeEvery(TYPES.ADD_ASSET_LIST, addNewAssetListSaga);
  yield takeEvery(TYPES.UPLOAD_ASSET, uploadAssetSaga);
  yield takeEvery(TYPES.UPLOAD_ELEMENT_ASSET, uploadElementAssetSaga);
  yield takeEvery(TYPES.REMOVE_ASSET_LIST, removeAssetListSaga);
  yield takeEvery(TYPES.REMOVE_ASSET, removeAssetSaga);
  yield takeEvery(TYPES.RESTORE_ASSET, restoreAssetSaga);

  yield takeEvery(
    TYPES.TOGGLE_SELECTED_ELEMENT_SAGA,
    toggleSelectedElementSaga,
  );

  yield takeEvery(TYPES.CREATE_ELEMENTS_GROUP, createElementsGroupSaga);
  yield takeEvery(TYPES.UPLOAD_IMAGE_BY_URL, uploadElementImageByUrlSaga);

  yield takeEvery(
    TYPES.UNBIND_GROUP_ELEMENT_STYLES,
    unbindGroupElementStylesSaga,
  );

  yield takeLatest(TYPES.LOAD_USERS, getUsersSaga);

  yield takeEvery(
    TYPES.GET_MY_PERMISSIONS_FOR_PROJECT,
    getMyPermissionsForProjectSaga,
  );

  yield takeEvery(
    TYPES.GET_ALL_USERS_PROJECT_PERMISSIONS,
    getAllUsersProjectPermissionsSaga,
  );

  yield takeEvery(
    TYPES.UPDATE_USER_PERMISSIONS_FOR_PROJECT,
    updateUserPermissionsForProjectSaga,
  );

  yield fork(viaSaga);
  yield fork(nnSaga);

  yield takeEvery(
    TYPES.UPDATE_UI_SETTINGS_PARAMETERS,
    updateUISettingsParametersSaga,
  );

  yield takeEvery(TYPES.SET_EDITABLE_SCREEN, setEditableScreenSaga);
  yield takeEvery(TYPES.CLEAR_EDITABLE_SCREEN, clearEditableScreenSaga);

  yield takeEvery(TYPES.UPLOAD_ICO_SCREEN, editIcoScreenSaga);
  yield takeEvery(
    TYPES.UPDATE_CURRENT_UI_FRAMEWORK,
    updateCurrentUIFrameworkSaga,
  );

  yield takeEvery(
    TYPES.UPDATE_CURRENT_UI_FRAMEWORK_VARIABLES,
    updateCurrentUIFrameworkVariablesSaga,
  );

  yield takeEvery(
    TYPES.RESET_CURRENT_UI_FRAMEWORK_VARIABLES,
    resetCurrentUIFrameworkVariablesSaga,
  );

  yield takeLatest(
    TYPES.PROCESS_DROP_TARGET_PARAMS,
    processDropTargetParamsSaga,
  );

  yield takeEvery(TYPES.PROCESS_DROP_ELEMENT, processDropElementSaga);

  yield takeEvery(TYPES.SET_ENABLED_PSEUDO_CLASS, setEnabledPseudoClassSaga);

  yield takeLatest(TYPES.GENERATE_IMAGE_PALETTE, generateImagePaletteSaga);
}
