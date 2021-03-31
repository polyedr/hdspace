import { all, call, put, select } from 'redux-saga/effects';
import { apiChangeRecursiveElement, apiCreateElement } from '@Api/element';
import DOMPurify from 'dompurify';
import {
  LibraryElement,
  PostUrlResponse,
  Result,
  Screen,
  StateElement,
  UserProjectPermission,
} from '@Src/types';
import convertHtml from '@Utils/convertHtml';
import CSSOM from 'cssom';
import { extractStyles } from '@Utils/stringHelper';
import IMAGES from '@Constants/images';
import { apiGetWebPage, apiPostURL } from '@Api/import';
import * as Actions from '@Redux/project/actions';
import {
  importHtml,
  updateElementImage,
  updateElementParameters,
} from '@Redux/project/actions';
import { reqWrapper } from '@Redux/project/sagas/shared';
import { enqueueSnackbar } from '@Redux/notification/actions';
import { selectElementsForScreen } from '@Redux/project/selectors/element';
import JSZip from 'jszip';
import withRequiredPermissions from '@Redux/permissions/wrappers/withRequiredPermissions';
import { selectCurrentScreen } from '../selectors/screen';

export const importHtmlSaga = withRequiredPermissions(
  UserProjectPermission.VIEW_PROJECT,
  UserProjectPermission.CHANGE_PROJECT,
)(function* (action: ReturnType<typeof importHtml>) {
  try {
    const { files, url } = action.payload;

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
      : htmlFiles.find((file) => file.name.includes('index.html'))?.text() ||
        htmlFiles.find((file) => !file.name.includes('.'))?.text(); // in case of html file comes with no extension

    if (!html) {
      throw new Error('At least one HTML file required');
    }

    const cssFiles = files.filter((file) => file.type === 'text/css');

    const externalStyles: string = yield Promise.all(
      cssFiles.map((file) => file.text()),
    ).then((result) => result.reduce((acc, curr) => acc + curr, ''));
    const htmlStyles = extractStyles(html);
    const css = externalStyles + htmlStyles;

    const clearHtml = DOMPurify.sanitize(html);

    const doc = new DOMParser().parseFromString(clearHtml, 'text/html');

    const { cssRules } = CSSOM.parse(css); // the actual type of cssRules is CSSStyleRule[] while the declared one is CSSOM.CSSRule[]
    // @ts-ignore
    const data = convertHtml(doc, cssRules);

    const { result: element, error }: Result<LibraryElement<any>> = yield call(
      reqWrapper,
      apiCreateElement,
      {
        data,
      },
    );
    if (element) {
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
      const imageElements = Object.values(elements).filter(
        (element) => element.type === 'image',
      );

      const imageFiles = files.filter((file) => file.type.includes('image/'));

      yield all(
        imageElements.map((element) => {
          const image = imageFiles.find((img) =>
            element.parameters.imageURL.includes(img.name),
          );
          return image
            ? put(updateElementImage(element.id, image, { screenId: id }))
            : put(
                updateElementParameters(
                  element.id,
                  {
                    imageURL: IMAGES.imageIcon,
                  },
                  {
                    screenId: id,
                  },
                ),
              );
        }),
      );

      const { error } = yield call(reqWrapper, apiChangeRecursiveElement, {
        data: { children: [element.id] },
        id: rootId,
      });
      if (error) throw new Error(error);
    }
    if (error) throw new Error(error);
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
});

const getTypeFromName = (name: string) => {
  if (!name.includes('.')) return 'text/html'; // in case of html file comes with no extension
  const ext = name.split('.').reverse()[0];

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

export const uploadImportUrlSaga = withRequiredPermissions(
  UserProjectPermission.VIEW_PROJECT,
  UserProjectPermission.CHANGE_PROJECT,
)(function* ({ payload: url }: ReturnType<typeof Actions.uploadImportUrl>) {
  try {
    const { result, error }: Result<PostUrlResponse> = yield call(
      reqWrapper,
      apiPostURL,
      {
        wpname: url,
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

    const archive = yield call(reqWrapper, apiGetWebPage, {
      wpname: result.wpname,
    });
    const zip = new JSZip();
    const unzipped = yield zip.loadAsync(archive); // unzip received file
    const zipObjects: JSZip.JSZipObject[] = Object.values(unzipped.files);

    const files = yield Promise.all(
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

    yield put(importHtml(Object.values(files), url));
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
});
