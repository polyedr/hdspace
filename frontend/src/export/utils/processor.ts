import axios, { AxiosError, AxiosResponse } from 'axios';
import JSZip from 'jszip';
import pretty from 'pretty';
// eslint-disable-next-line
import styles from '!raw-loader!sass-loader!@Src/styles/index.scss';

const assetAttributes = ['src', 'href'];
const cssResources = [
  'mdc.checkbox.css',
  'mdc.radio.css',
  'mdc.form-field.css',
  'mdc.list.css',
  'mdc.menu-surface.css',
  'mdc.menu.css',
  'mdc.select.css',
];
const jsResources = ['app.js'];

// eslint-disable-next-line import/prefer-default-export
export const processHTML = async (html: string, assetsFolder: JSZip | null) => {
  const dom = new DOMParser().parseFromString(html, 'text/html');
  const allNodes = dom.getElementsByTagName('*');
  for (let i = 0; i < allNodes.length; i++) {
    const element = allNodes.item(i) as HTMLElement;
    for (let j = 0; j < assetAttributes.length; j++) {
      const attr = assetAttributes[j];
      if (element.hasAttribute(attr)) {
        const url = element.getAttribute(attr) as string;
        switch (element.tagName.toLowerCase()) {
          case 'a': {
            if (url.startsWith('/')) {
              const { location } = document;
              const domainPath = `${location.protocol}//${location.hostname}${
                location.port ? `:${location.port}` : ''
              }`;
              element.setAttribute(
                attr,
                `${domainPath}${element.getAttribute(attr)}`,
              );
            }
            break;
          }
          case 'img':
          default: {
            const assetName = url.substring(url.lastIndexOf('/') + 1);
            element.setAttribute(attr, `assets/${assetName}`);
            // eslint-disable-next-line no-await-in-loop
            await axios
              .get(url, {
                responseType: 'blob',
              })
              .then((response) => {
                if (response.headers['content-type'].indexOf('image') !== -1) {
                  const blob = new Blob([response.data], {
                    type: response.headers['content-type'],
                  });
                  assetsFolder?.file(assetName, blob, {
                    binary: true,
                  });
                }
              })
              .catch((error: AxiosError) => {
                // eslint-disable-next-line no-console
                console.error(error);
                return Promise.resolve();
              });
            break;
          }
        }
      }
    }
  }
  return dom.body.innerHTML;
};

export const processCSS = async (cssFolder: JSZip | null) => {
  cssFolder?.file('fonts.css', styles);
  return Promise.all(
    cssResources.map((resource) => axios.get(`/styles/material/${resource}`)),
  )
    .then((responses: AxiosResponse[]) => {
      responses.forEach((response: AxiosResponse) => {
        if (!response.request) {
          // eslint-disable-next-line no-console
          console.error('Request is not defined!', response);
          return;
        }
        const { responseURL } = response.request;

        cssFolder?.file(
          responseURL.substring(responseURL.lastIndexOf('/')),
          response.data,
        );
      });
    })
    .catch((error: AxiosError) => {
      return Promise.reject(error);
    });
};

export const processJS = async (jsFolder: JSZip | null) => {
  return Promise.all(
    jsResources.map((resource) => axios.get(`/js/export/${resource}`)),
  ).then((responses: AxiosResponse[]) => {
    responses.forEach((response: AxiosResponse) => {
      if (!response.request) {
        console.error('Request is not defined!', response);
        return;
      }
      const { responseURL } = response.request;
      jsFolder?.file(
        responseURL.substring(responseURL.lastIndexOf('/')),
        response.data,
      );
    });
  });
};

export const getHtmlFromTemplate = (screenName: string, body: string) =>
  pretty(`
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
    <link rel="stylesheet" type="text/css" href="css/mdc.checkbox.css" />
    <link rel="stylesheet" type="text/css" href="css/mdc.radio.css" />
    <link rel="stylesheet" type="text/css" href="css/mdc.form-field.css" />
    <link rel="stylesheet" type="text/css" href="css/mdc.list.css" />
    <link rel="stylesheet" type="text/css" href="css/mdc.menu-surface.css" />
    <link rel="stylesheet" type="text/css" href="css/mdc.menu.css" />
    <link rel="stylesheet" type="text/css" href="css/mdc.select.css" />
    <link rel="stylesheet" type="text/css" href="css/fonts.css" />
    <script src="https://unpkg.com/mat-ripple"></script> 
    <script src="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js"></script>
    <title>${screenName}</title>
  </head>
  <body>
    ${body}
    <script src="js/app.js"></script>
  </body>
</html>
`);
