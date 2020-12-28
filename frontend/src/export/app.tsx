import React from 'react';
import { Provider } from 'react-redux';
import ReactDOMServer from 'react-dom/server';
import { ConnectedRouter } from 'connected-react-router';
import { ServerStyleSheets, ThemeProvider } from '@material-ui/core/styles';
import JSZip from 'jszip';
import theme from '@Src/styles/Theme';
import { store } from '@Redux/store';
import { AppReduxState } from '@Redux/types';
import { selectCurrentRootId } from '@Redux/project/selectors/element';
import history from '@Redux/history';
import ExportedElement from './components/ExportedElement';
import {
  getHtmlFromTemplate,
  processCSS,
  // processFonts,
  processHTML,
  processJS,
} from './utils/processor';

const createArchive = (screenName: string, html: string, css: string) => {
  const zip = new JSZip();
  const cssFolder = zip.folder('css');
  const jsFolder = zip.folder('js');
  const assetsFolder = zip.folder('assets');
  // const fontsFolder = assetsFolder?.folder('fonts');

  // eslint-disable-next-line no-console
  Promise.all([
    processHTML(html, assetsFolder),
    processCSS(cssFolder),
    processJS(jsFolder),
    // rocessFonts(fontsFolder),
  ]).then(([htmlResponse]) => {
    zip.file('index.html', getHtmlFromTemplate(screenName, htmlResponse));
    cssFolder?.file('style.css', css);
    zip.generateAsync({ type: 'blob' }).then((content: Blob) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(content);
      a.download = 'page.zip';
      a.click();
    });
  });
};

const exportHTML = (screenName: string) => {
  const sheets = new ServerStyleSheets();

  const state = store.getState() as AppReduxState;

  const rootId = selectCurrentRootId(state);

  const html = ReactDOMServer.renderToStaticMarkup(
    sheets.collect(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <ThemeProvider theme={theme}>
            <ExportedElement elementId={rootId} state={state} />
          </ThemeProvider>
        </ConnectedRouter>
      </Provider>,
    ),
  );

  createArchive(screenName, html, sheets.toString());
};

export default exportHTML;
