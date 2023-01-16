import axios, { AxiosError, AxiosResponse } from 'axios';
import JSZip from 'jszip';
import pretty from 'pretty';
import decamelize from 'decamelize';
import cssbeautify from 'cssbeautify';
import { toClassName } from '@Utils/stringHelper';
import { ProjectClass, ScreenMetaData, StateElement } from '@Src/types';
import logger from 'loglevel';
import { getFontsLink } from './fonts';

const assetAttributes = ['src', 'href'];
const cssCustomResources = ['clock.css', 'ripple.css'];
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
        const url = element.getAttribute(attr);
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
              .catch(async (error: AxiosError) => {
                logger.error(error);
                return await Promise.resolve();
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
  html: string,
  cssFolder: JSZip | null,
  entityClasses: ProjectClass[],
  sharedClasses: ProjectClass[],
) => {
  const cssResourcesPromise = Promise.all([
    ...cssCustomResources.map(
      async (resource) => await axios.get(`/styles/${resource}`),
    ),
  ])
    .then((responses: AxiosResponse[]) => {
      responses.forEach((response: AxiosResponse) => {
        if (!response.request) {
          logger.error('Request is not defined!', response);
          return;
        }
        const { responseURL } = response.request;
        if (responseURL.includes('clock') && !html.includes('clock-widget'))
          return;

        cssFolder?.file(
          responseURL.substring(responseURL.lastIndexOf('/')),
          response.data,
        );
      });
    })
    .catch(async (error: AxiosError) => await Promise.reject(error));

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

  return await Promise.all([
    cssResourcesPromise,
    entityStylesPromise,
    sharedStylesPromise,
  ]);
};

export const processJS = async (html: string, jsFolder: JSZip | null) =>
  await Promise.all(
    jsResources.map(
      async (resource) => await axios.get(`/js/export/${resource}`),
    ),
  ).then((responses: AxiosResponse[]) => {
    responses.forEach((response: AxiosResponse) => {
      if (!response.request) {
        logger.error('Request is not defined!', response);
        return;
      }
      const { responseURL } = response.request;

      if (responseURL.includes('calendar') && !html.includes('calendar-widget'))
        return;

      if (responseURL.includes('map') && !html.includes('google-map')) return;

      if (
        (responseURL.includes('clock-widget') ||
          responseURL.includes('clock')) &&
        !html.includes('clock-widget')
      )
        return;

      jsFolder?.file(
        responseURL.substring(responseURL.lastIndexOf('/')),
        response.data,
      );
    });
  });

export const processIco = async (
  urlIco: string | null,
  assetsFolder: JSZip | null,
) => {
  if (!urlIco) {
    return await Promise.resolve();
  }
  const assetName = 'favicon.ico';
  return await axios
    .get(urlIco, {
      responseType: 'blob',
    })
    .then((response) => {
      const blob = new Blob([response.data], {
        type: response.headers['content-type'],
      });
      assetsFolder?.file(assetName, blob, {
        binary: true,
      });
    })
    .catch(async (error: AxiosError) => {
      logger.error(error);
      return await Promise.resolve();
    });
};

export const getHtmlFromTemplate = (
  screenName: string,
  body: string,
  mapComponents: StateElement[],
  currentUIFramework: any,
  meta?: ScreenMetaData,
) => {
  const getUIFrameworkLink = (frameworkName: string) => {
    if (frameworkName.includes('bootstrap')) {
      return `<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/css/bootstrap.min.css" /> 
      <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js"></script>`;
    }
    if (frameworkName.includes('material')) {
      return `<link rel="stylesheet" type="text/css" href="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css" />
      <script type="text/javascript" src="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js"></script>`;
    }
    return '';
  };
  return pretty(`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    ${
      meta &&
      Object.entries(meta)
        .map(([key, value]) => {
          if (value && key !== 'title' && key !== 'faviconUrl') {
            return `<meta name="${key}" content="${value}"/>`;
          }
          return '';
        })
        .join('\n')
    }
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
    ${
      body.includes('clock-widget')
        ? '<link rel="stylesheet" type="text/css" href="css/_/clock.css" />'
        : ''
    }
    <link rel="stylesheet" type="text/css" href="css/_/ripple.css" />
    <link rel="stylesheet" type="text/css" href="css/shared.css" />
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/color-calendar/dist/css/theme-basic.css" />
    ${getUIFrameworkLink(currentUIFramework.name)}

    <script src="https://unpkg.com/mat-ripple"></script>
    ${
      body.includes('google-map')
        ? '<script type="text/javascript" src="js/_/map.js" defer></script>'
        : ''
    }
    
    <script type="text/javascript" src="js/_/clock-widget.js"></script> 
    ${mapComponents.map((component) => {
      const { apiKey } = component.parameters.map_props;
      return `<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?callback=__googleMapsCallback${
        apiKey ? '' : `&API_KEY=${apiKey}`
      }" defer></script>`;
    })}
    <script src="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js"></script>
    <title>${meta?.title || screenName}</title>
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
    ${
      currentUIFramework.themeVariables &&
      `<style type="text/css">
          :root {
        ${Object.keys(currentUIFramework.themeVariables)
          .map(
            (varName) =>
              `--${varName}: ${currentUIFramework.themeVariables[varName]}`,
          )
          .join(';')}
    }
        </style>`
    }
  </head>
  <body>
    ${body}
    <script src="js/_/app.js"></script>
    ${
      body.includes('calendar-widget')
        ? `<script src="js/_/calendar.js">\n
        </script> <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/color-calendar/dist/bundle.js"></script>`
        : ''
    }
    ${
      body.includes('clock-widget')
        ? '<script src="js/_/clock.js"></script>'
        : ''
    }
  </body>
</html>
`);
};
