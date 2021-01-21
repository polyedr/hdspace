import axios, { AxiosError, AxiosResponse } from 'axios';
import JSZip from 'jszip';
import pretty from 'pretty';
import decamelize from 'decamelize';
import cssbeautify from 'cssbeautify';
import { toClassName } from '@Utils/stringHelper';
import { ProjectClass, StateElement } from '@Src/types';
import { getFontsLink } from './fonts';

const assetAttributes = ['src', 'href'];
const cssMaterialResources = [
  'mdc.checkbox.css',
  'mdc.radio.css',
  'mdc.form-field.css',
  'mdc.list.css',
  'mdc.menu-surface.css',
  'mdc.menu.css',
  'mdc.select.css',
];
const cssCustomResources = ['clock.css'];
const jsResources = [
  'app.js',
  'map.js',
  'clock.js',
  'clock-widget.js',
  'calendar.js',
];

const cssReducer = (styles: string, classInstance: ProjectClass) => {
  const styleString = `
    .${toClassName(classInstance.className)}{${Object.keys(
    classInstance.rules,
  ).reduce(
    (styles, ruleName) =>
      `${styles}${decamelize(ruleName, '-')}:${classInstance.rules[ruleName]};`,
    '',
  )}}`;
  return `${styles}${styleString}`;
};

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

export const processCSS = async (
  cssFolder: JSZip | null,
  entityClasses: ProjectClass[],
  sharedClasses: ProjectClass[],
) => {
  const cssResourcesPromise = Promise.all([
    ...cssMaterialResources.map((resource) =>
      axios.get(`/styles/material/${resource}`),
    ),
    ...cssCustomResources.map((resource) => axios.get(`/styles/${resource}`)),
  ])
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

  const entityStylesPromise = new Promise((resolve, reject) => {
    if (!cssFolder) {
      reject(new Error('No css folder'));
    }
    const entityStyles = entityClasses.reduce(cssReducer, '');
    resolve(cssFolder?.file('entities.css', cssbeautify(entityStyles)));
  });

  const sharedStylesPromise = new Promise((resolve, reject) => {
    if (!cssFolder) {
      reject(new Error('No css folder'));
    }
    const groupStyles = sharedClasses.reduce(cssReducer, '');
    resolve(cssFolder?.file('shared.css', cssbeautify(groupStyles)));
  });

  return Promise.all([
    cssResourcesPromise,
    entityStylesPromise,
    sharedStylesPromise,
  ]);
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

export const getHtmlFromTemplate = (
  screenName: string,
  body: string,
  mapComponents: StateElement[],
) =>
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
    ${getFontsLink('Lato', 'Merriweather', 'Monsterrat')}
    ${getFontsLink('Open Sans', 'Oswald', 'Raleway', 'Ubuntu')}
    ${getFontsLink('Roboto Mono', 'Roboto Condensed', 'Source Sans Pro')}
    <link rel="stylesheet" type="text/css" href="css/entities.css" />
    <link rel="stylesheet" type="text/css" href="css/style.css" />
    <link rel="stylesheet" type="text/css" href="css/mdc.checkbox.css" />
    <link rel="stylesheet" type="text/css" href="css/mdc.radio.css" />
    <link rel="stylesheet" type="text/css" href="css/mdc.form-field.css" />
    <link rel="stylesheet" type="text/css" href="css/mdc.list.css" />
    <link rel="stylesheet" type="text/css" href="css/mdc.menu-surface.css" />
    <link rel="stylesheet" type="text/css" href="css/mdc.menu.css" />
    <link rel="stylesheet" type="text/css" href="css/mdc.select.css" />
    <link rel="stylesheet" type="text/css" href="css/clock.css" />
    <link rel="stylesheet" type="text/css" href="css/shared.css" />    
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/color-calendar/dist/css/theme-basic.css" />    
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/color-calendar/dist/bundle.js"></script>
    <script src="https://unpkg.com/mat-ripple"></script>
    <script type="text/javascript" src="js/map.js" defer></script>
    <script type="text/javascript" src="js/clock-widget.js"></script>
    ${mapComponents.map((component) => {
      const { apiKey } = component.parameters.map_props;
      return `<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?callback=__googleMapsCallback${
        apiKey ? '' : `&API_KEY=${apiKey}`
      }" defer></script>`;
    })}
    <script src="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js"></script>
    <title>${screenName}</title>
  </head>
  <body>
    ${body}
    <script src="js/app.js"></script>
    <script src="js/calendar.js"></script>
    <script src="js/clock.js"></script>
  </body>
</html>
`);
