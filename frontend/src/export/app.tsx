import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import ReactDOMServer from 'react-dom/server';
import { ServerStyleSheets, ThemeProvider } from '@material-ui/core/styles';
import JSZip from 'jszip';
import theme from '@Src/styles/Theme';
import { store } from '@Redux/store';
import { AppReduxState } from '@Redux/types';
import { selectCurrentRootId } from '@Redux/project/selectors/element';
import { ProjectClass, ScreenMetaData } from '@Src/types';
import { selectCurrentProjectClasses } from '@Redux/project/selectors/base';
import { DEFAULT_ELEMENTS_STYLES } from '@Domain/libraryElements/defaultStyles';
import ExportedElement from './components/ExportedElement';
import {
  getHtmlFromTemplate,
  processCSS,
  processHTML,
  processIco,
  processJS,
} from './utils/processor';

const entityClassNames = Object.keys(DEFAULT_ELEMENTS_STYLES);

type ExportedStyleSheets = {
  css: string;
  entityClasses: ProjectClass[];
  sharedClasses: ProjectClass[];
};

const createArchive = (
  screenName: string,
  html: string,
  css: string,
  state: AppReduxState,
  metadata?: ScreenMetaData,
) => {
  const projectClasses = selectCurrentProjectClasses(state);

  const entityClasses = projectClasses.filter((classInstance) =>
    entityClassNames.includes(classInstance.className),
  );
  const sharedClasses = projectClasses.filter(
    (classInstance) => !entityClassNames.includes(classInstance.className),
  );
  const { elements } = state.project.data;
  const mapComponents = Object.keys(elements)
    .filter((id) => elements[id].type === 'map')
    .map((id: string) => elements[id]);
  const zip = new JSZip();
  const cssFolder = zip.folder('css');
  const jsFolder = zip.folder('js');
  const assetsFolder = zip.folder('assets');

  Promise.all([
    processHTML(html, assetsFolder),
    processCSS(cssFolder, entityClasses, sharedClasses),
    processJS(jsFolder),
    processIco(metadata?.faviconUrl || null, zip),
  ]).then(([htmlResponse]) => {
    zip.file(
      'index.html',
      getHtmlFromTemplate(screenName, htmlResponse, mapComponents, metadata),
    );
    cssFolder?.file('style.css', css);
    zip.generateAsync({ type: 'blob' }).then((content: Blob) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(content);
      a.download = `${screenName}.zip`;
      a.click();
    });
  });
};

const exportHTML = (screenName: string, metadata?: ScreenMetaData) => {
  const sheets = new ServerStyleSheets();

  const state = store.getState() as AppReduxState;

  const rootId = selectCurrentRootId(state);

  const html = ReactDOMServer.renderToStaticMarkup(
    sheets.collect(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <ExportedElement elementId={rootId} state={state} />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>,
    ),
  );

  createArchive(screenName, html, sheets.toString(), state, metadata);
};

export default exportHTML;
