import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { ServerStyleSheets, ThemeProvider } from '@material-ui/core/styles';
import JSZip from 'jszip';
import theme from '@Src/styles/Theme';
import { store } from '@Redux/store';
import { AppReduxState } from '@Redux/types';
import { selectCurrentRootId } from '@Redux/project/selectors/element';
import ExportedElement from './components/ExportedElement';
import { parseHTML } from './utils/parser';

const getHtmlFromTemplate = (body: string) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, minimum-scale=1.0"
    />
    <meta
      name="google-site-verification"
      content="m2BjG5J2rJf552uAF0lgzMClJyuz0N-tjQ5kh5yewOo"
    />
    <link
      href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet"
    />
    <link rel="stylesheet" type="text/css" href="css/style.css" />
    <title>Editor</title>
  </head>
  <body>
    ${body}
  </body>
</html>
`;

const createArchive = (html: string, css: string) => {
  const zip = new JSZip();
  const cssFolder = zip.folder('css');
  const assetsFolder = zip.folder('assets');

  parseHTML(html, assetsFolder).then((result: string) => {
    zip.file('index.html', getHtmlFromTemplate(result));
    cssFolder?.file('style.css', css);
    zip.generateAsync({ type: 'blob' }).then((content: Blob) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(content);
      a.download = 'page.zip';
      a.click();
    });
  });
};

const exportHTML = () => {
  const sheets = new ServerStyleSheets();

  const state = store.getState() as AppReduxState;

  const rootId = selectCurrentRootId(state);

  const html = ReactDOMServer.renderToString(
    sheets.collect(
      <ThemeProvider theme={theme}>
        <ExportedElement elementId={rootId} state={state} />
      </ThemeProvider>,
    ),
  );

  createArchive(html, sheets.toString());
};

export default exportHTML;
