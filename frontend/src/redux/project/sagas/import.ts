// @ts-nocheck
import { call, put, select } from 'redux-saga/effects';
import { apiChangeRecursiveElement, apiCreateElement } from '@Api/element';
import DOMPurify from 'dompurify';
import {
  LibraryElement,
  PostURLCheckRobots,
  PostUrlResponse,
  Result,
  Screen,
  StateElement,
  UpdateDataActionType,
  UserProjectPermission,
  importData,
} from '@Src/types';
import convertHtml from '@Utils/convertHtml';
import CSSOM from 'cssom';
import { extractStyles } from '@Utils/stringHelper';
import IMAGES from '@Constants/images';
import { apiGetWebPage, apiPostURL, apiPostURLCheckRobots } from '@Api/import';
import * as Actions from '@Redux/project/actions';
import {
  importHtml,
  updateElementParameters,
  checkImportHTML,
} from '@Redux/project/actions';
import { reqWrapper } from '@Redux/project/sagas/shared';
import { enqueueSnackbar } from '@Redux/notification/actions';
import { selectElementsForScreen } from '@Redux/project/selectors/element';
import JSZip from 'jszip';
import withRequiredPermissions from '@Redux/permissions/wrappers/withRequiredPermissions';
import {
  selectCurrentScreenId,
  selectCurrentScreen,
} from '@Redux/project/selectors/screen';

import { updateElementImage } from './element';
import { updateOrReplaceElementParameters } from './common';

export const importHtmlSaga = withRequiredPermissions(
  UserProjectPermission.VIEW_PROJECT,
  UserProjectPermission.CHANGE_PROJECT,
)(function* (action: ReturnType<typeof importHtml>) {
  yield put(Actions.setValueImportLoader(true));
  try {
    const { imageFiles, imageElements, element } =
      action.payload.importHtmlData;

    if (element) {
      const { id, element: rootId }: Screen = yield select(selectCurrentScreen);

      // start upload image to canvase and set html code in canvase
      if (imageFiles && imageElements) {
        yield put(
          Actions.addStateElements(
            [{ elements: [element], parentId: rootId }],
            {
              screenId: id,
              useHistory: true,
            },
          ),
        );

        try {
          let imageIndex = 0;
          while (imageElements.length > 0) {
            const element = imageElements[imageIndex];
            let image: File | undefined;
            try {
              image = imageFiles.find((img) =>
                element.parameters.imageURL.includes(img.name),
              );
            } catch (e) {
              image = undefined;
            }
            if (image) {
              yield call(updateElementImage, element.id, image, {
                screenId: id,
                useHistory: true,
              });
            } else {
              yield call(
                updateOrReplaceElementParameters,
                updateElementParameters(
                  element.id,
                  {
                    imageURL: element.parameters.imageURL || IMAGES.imageIcon,
                  },
                  {
                    screenId: id,
                    useHistory: true,
                  },
                ),
                UpdateDataActionType.UPDATE,
              );
            }
            imageIndex++;
          }
        } catch (e) {
          yield put(
            enqueueSnackbar(
              {
                message: e.message,
                options: { variant: 'error' },
              },
              e,
            ),
          );
        }
      }
      // end here
      const { error } = yield call(reqWrapper, apiChangeRecursiveElement, {
        data: { children: [element.id] },
        id: rootId,
      });
      if (error) throw new Error(error);

      yield put(
        enqueueSnackbar({
          message: 'Successfully site is import.',
          options: { variant: 'success' },
        }),
      );
      yield put(Actions.toggleContainersBorders(true));
    } else {
      throw new Error('Something went wrong');
    }
  } catch (e) {
    yield put(
      enqueueSnackbar(
        {
          message: e.message,
          options: { variant: 'error' },
        },
        e,
      ),
    );
  } finally {
    yield put(Actions.setValueImportLoader(false));
    yield put(Actions.setValueCheckRobots(false));
  }
});

const getTypeFromName = (name: string) => {
  if (!name.includes('.')) return 'text/html'; // in case of html file comes with no extension
  const ext = name.split('?')[0].split('.').reverse()[0];

  switch (ext) {
    case 'html':
    case 'htm':
      return 'text/html';

    case 'css':
      return 'text/css';

    case 'txt':
      return 'text/plain';

    case 'jpeg':
    case 'jpg':
      return 'image/jpeg';

    case 'ico':
      return 'image/vnd.microsoft.icon';

    case 'png':
      return 'image/png';

    case 'svg':
      return 'image/svg+xml';

    case 'webp':
      return 'image/webp';

    default:
      return 'applicatin/octet-stream'; // unknown mime-type
  }
};

export const checkRobotsFileFromUrlSaga = withRequiredPermissions(
  UserProjectPermission.VIEW_PROJECT,
  UserProjectPermission.CHANGE_PROJECT,
)(function* ({ payload: url }) {
  try {
    const updateUrl = (url: string) => {
      let newEditUrl: string = url;
      if (url.length <= 3) {
        return null;
      }
      if (!url.includes('https://')) {
        newEditUrl = `https://${url}`;
      }
      if (newEditUrl[newEditUrl.length - 1] === '/') {
        newEditUrl = `${newEditUrl}robots.txt`;
      } else {
        newEditUrl = `${newEditUrl}/robots.txt`;
      }
      return newEditUrl;
    };
    const newUrl = updateUrl(url);
    if (!newUrl) {
      throw new Error('empty');
    }
    const { result, error }: Result<PostURLCheckRobots> = yield call(
      reqWrapper,
      apiPostURLCheckRobots,
      {
        fileurl: newUrl,
      },
    );
    if (error) {
      throw new Error(
        error === 'Request failed with status code 400'
          ? 'Enter a valid URL'
          : error,
      );
    }
    if (!result) {
      throw new Error('Something went wrong');
    }
    if (!result.wget_fetch)
      yield put(
        enqueueSnackbar({
          message: 'This site cannot be imported due to privacy law',
          options: { variant: 'error' },
        }),
      );
    yield put(Actions.setValueCheckRobots(result.wget_fetch));
  } catch (e) {
    yield put(Actions.setValueCheckRobots(false));
    if (e.message !== 'empty') {
      yield put(
        enqueueSnackbar(
          {
            message: e.message,
            options: { variant: 'error' },
          },
          e,
        ),
      );
    }
  }
});

export const importHtmlCheckSaga = withRequiredPermissions(
  UserProjectPermission.VIEW_PROJECT,
  UserProjectPermission.CHANGE_PROJECT,
)(function* (action: ReturnType<typeof checkImportHTML>) {
  yield put(Actions.setValueImportLoader(true));
  const currentScreenId = yield select(selectCurrentScreenId);
  let canvasElement;
  try {
    const { url } = action.payload;
    let { files } = action.payload;
    // start only url convert & import
    if (files.length === 0 && url !== '') {
      try {
        const { result, error }: Result<PostUrlResponse> = yield call(
          reqWrapper,
          apiPostURL,
          {
            wpname: url,
          },
        );

        if (error) {
          yield put(
            Actions.setValueImport({
              notSupportedTag: null,
              canvasData: {},
              importSuccessRawData: {},
              error: true,
            }),
          );
          throw new Error(
            error === 'Request failed with status code 400'
              ? 'Enter a valid URL'
              : error,
          );
        }
        if (!result) {
          yield put(
            Actions.setValueImport({
              notSupportedTag: null,
              canvasData: {},
              importSuccessRawData: {},
              error: true,
            }),
          );
          throw new Error('Something went wrong');
        }

        const archive = yield call(reqWrapper, apiGetWebPage, {
          wpname: result.wpname,
        });
        const zip = new JSZip();
        const unzipped = yield zip.loadAsync(archive); // unzip received file
        const zipObjects: JSZip.JSZipObject[] = Object.values(unzipped.files);

        files = yield Promise.all(
          zipObjects
            .filter((zipObj) => !zipObj.dir) // filter out directories
            .map(async (zipObj) => {
              const blob = await zipObj.async('blob'); // convert zipObject to blob
              const file = new File([blob], zipObj.name, {
                lastModified: zipObj.date.getTime(),
                type: getTypeFromName(zipObj.name),
              }); // create File from blob
              return file;
            }),
        );
      } catch (e) {
        yield put(Actions.setValueImportLoader(false));
        yield put(
          Actions.setValueImport({
            notSupportedTag: null,
            canvasData: {},
            importSuccessRawData: {},
            error: true,
          }),
        );
        throw new Error(e.message);
      }
    }
    // end here
    let indexPathname: string;

    if (url) {
      const { pathname } = new URL(url);
      indexPathname = pathname;
    }

    const htmlFiles = files.filter((file) => file.type === 'text/html');

    const html: string = yield url
      ? htmlFiles
          .find((file) => file.name.includes(indexPathname.slice(1))) // remove slash at the beginning
          ?.text()
      : htmlFiles[0]?.text();

    if (!html) {
      yield put(
        Actions.setValueImport({
          notSupportedTag: null,
          canvasData: {},
          importSuccessRawData: {},
          error: true,
        }),
      );
      throw new Error('At least one HTML file required');
    }

    const cssFiles = files.filter((file) => file.type === 'text/css');

    const externalStyles: string = yield Promise.all(
      cssFiles.map(async (file) => await file.text()),
    ).then((result) => result.reduce((acc, curr) => acc + curr, ''));

    const htmlStyles = extractStyles(html);
    const css = externalStyles + htmlStyles;
    const clearHtml = DOMPurify.sanitize(html);
    const doc = new DOMParser().parseFromString(clearHtml, 'text/html');

    const { cssRules } = CSSOM.parse(css); // the actual type of cssRules is CSSStyleRule[] while the declared one is CSSOM.CSSRule[]
    // @ts-expect-error
    const data = convertHtml(doc, cssRules);

    const listOfUnsupportedElement = data?.listOfUnsupportedElement
      ? data?.listOfUnsupportedElement.join(', ')
      : '';

    if (data?.listOfUnsupportedElement) {
      delete data?.listOfUnsupportedElement;
    }

    // image check start here
    const { result: element, error }: Result<LibraryElement<any>> = yield call(
      reqWrapper,
      apiCreateElement,
      {
        data,
      },
    );
    let uploadImage: number = 0;
    let notUploadImage: number = 0;
    let imageFiles: File[] = [];
    let imageElements: StateElement[] = [];
    if (element) {
      canvasElement = element;
      const { id, element: rootId }: Screen = yield select(selectCurrentScreen);

      yield put(
        Actions.addStateElements([{ elements: [element], parentId: rootId }], {
          screenId: id,
          useHistory: true,
        }),
      );

      const elements: StateElement[] = yield select(
        selectElementsForScreen(id),
      );
      imageElements = Object.values(elements).filter(
        (element) => element.type === 'image',
      );
      imageFiles = files.filter((file) => file.type.includes('image/'));

      imageElements.forEach((element) => {
        let image: File | undefined;

        try {
          image = imageFiles.find((img) =>
            element.parameters.imageURL.includes(img.name),
          );
        } catch (e) {
          image = undefined;
        }

        if (image) {
          uploadImage++;
        } else {
          notUploadImage++;
        }
      });

      const { error } = yield call(reqWrapper, apiChangeRecursiveElement, {
        data: { children: [element.id] },
        id: rootId,
      });
      if (error) {
        yield put(
          Actions.setValueImport({
            notSupportedTag: null,
            canvasData: {},
            importSuccessRawData: {},
            error: true,
          }),
        );
        throw new Error(error);
      }
    }

    if (error) {
      yield put(
        Actions.setValueImport({
          notSupportedTag: null,
          canvasData: {},
          importSuccessRawData: {},
          error: true,
        }),
      );
      throw new Error(error);
    }
    // end here

    const importSiteData: importData = {
      notSupportedTag: null,
      canvasData: {},
      importSuccessRawData: {},
      error: false,
    };

    importSiteData.notSupportedTag = '';
    importSiteData.canvasData = {
      imageElements,
      imageFiles,
      element,
    };

    if (listOfUnsupportedElement.length !== 0) {
      importSiteData.notSupportedTag = listOfUnsupportedElement
        .toString()
        .toLowerCase();
    }

    const totalAvailbleTag = 70;
    const totalNotAvailbleTag = listOfUnsupportedElement.split(', ').length;

    importSiteData.importSuccessRawData = {
      successPercentage:
        (totalNotAvailbleTag * (totalNotAvailbleTag + totalAvailbleTag)) / 100,
      totalImageFileUpload: imageFiles?.length
        ? uploadImage + notUploadImage
        : notUploadImage,
      totalUploadImage: uploadImage,
      totalNotUploadImage: notUploadImage,
      totalCssFiles: cssFiles?.length ? cssFiles?.length : 0,
    };

    importSiteData.error = false;

    yield put(Actions.setValueImport(importSiteData));
  } catch (e) {
    yield put(
      Actions.setValueImport({
        notSupportedTag: null,
        canvasData: {},
        importSuccessRawData: {},
        error: true,
      }),
    );
    yield put(
      enqueueSnackbar(
        {
          message: e.message,
          options: { variant: 'error' },
        },
        e,
      ),
    );
  } finally {
    if (canvasElement) {
      yield put(
        Actions.deleteElement(canvasElement?.id, {
          screenId: currentScreenId,
        }),
      );
    }
    yield put(Actions.setValueImportLoader(false));
    yield put(Actions.setValueCheckRobots(false));
  }
});
