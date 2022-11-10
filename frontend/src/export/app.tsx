import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import ReactDOMServer from 'react-dom/server';
import { ServerStyleSheets, ThemeProvider } from '@material-ui/core/styles';
import {
  ThemeProvider as MuiThemeProvider,
  StyledEngineProvider,
} from '@mui/material/styles';
import JSZip from 'jszip';
import { themeOld as theme } from '@Src/styles/Theme';
// eslint-disable-next-line import/named
import { store } from '@Redux/store';
import { AppReduxState } from '@Redux/types';
import {
  selectCurrentProjectClasses,
  selectCurrentUIFramework,
} from '@Redux/project/selectors/base';
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

const createArchive = async (
  allScreensData: Array<any>,
  allScreensHtml: Array<any>,
  allScreensCss: Array<any>,
  state: AppReduxState,
  projectName: string,
) => {
  const projectClasses = selectCurrentProjectClasses(state);
  const entityClasses = projectClasses.filter((classInstance) =>
    entityClassNames.includes(classInstance.className),
  );
  const sharedClasses = projectClasses.filter(
    (classInstance) => !entityClassNames.includes(classInstance.className),
  );
  const { elements } = state.project.data;
  const currentUIFramework = selectCurrentUIFramework(state);
  const mapComponents = Object.keys(elements)
    .filter((id) => elements[id].type === 'map')
    .map((id: string) => elements[id]);

  const zip = new JSZip();

  const zipData = allScreensData.map((data) => {
    const screenFolder = zip.folder(`${data.name}`);
    const cssFolder = zip.folder(`${data.name}/css`);
    const jsFolder = zip.folder(`${data.name}/js`);
    const assetsFolder = zip.folder(`${data.name}/assets`);

    return Promise.all([
      processHTML(allScreensHtml[data.name], assetsFolder),
      processCSS(
        allScreensHtml[data.name],
        cssFolder,
        entityClasses,
        sharedClasses,
      ),
      processJS(allScreensHtml[data.name], jsFolder),
      processIco(data.screenData.meta.faviconUrl || null, zip),
    ]).then(([htmlResponse]) => {
      screenFolder?.file(
        'index.html',
        getHtmlFromTemplate(
          data.name,
          htmlResponse,
          mapComponents,
          currentUIFramework,
          data.screenData,
        ),
      );

      cssFolder?.file('style.css', allScreensCss[data.name]);
      return true;
    });
  });

  Promise.all(zipData).then(() => {
    zip.generateAsync({ type: 'blob' }).then((content: Blob) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(content);
      a.download = `${projectName}.zip`;
      a.click();
    });
  });
};

const exportHTML = (allScreensData, projectName) => {
  const state = store.getState() as AppReduxState;
  const allScreensHtmlData: Array<any> = [];
  const allScreensStyleData: Array<any> = [];

  allScreensData.forEach((data, index) => {
    const sheets = new ServerStyleSheets();
    const html = ReactDOMServer.renderToStaticMarkup(
      sheets.collect(
        <Provider store={store}>
          <StyledEngineProvider injectFirst>
            <MuiThemeProvider theme={theme}>
              <ThemeProvider theme={theme}>
                <BrowserRouter>
                  <ExportedElement elementId={data.element} state={state} />
                </BrowserRouter>
              </ThemeProvider>
            </MuiThemeProvider>
          </StyledEngineProvider>
        </Provider>,
      ),
    );
    allScreensHtmlData[allScreensData[index].name] = html;
    allScreensStyleData[allScreensData[index].name] = sheets.toString();
  });

  createArchive(
    allScreensData,
    allScreensHtmlData,
    allScreensStyleData,
    state,
    projectName,
  );
};

export default exportHTML;
