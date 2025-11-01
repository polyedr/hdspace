import { CacheProvider } from '@emotion/react';
import React, { useMemo } from 'react';
import FrameComponent, { FrameContextConsumer } from 'react-frame-component';
import createCache from '@emotion/cache';
import { StyleSheetManager } from 'styled-components';
import { useSelector } from 'react-redux';
import { StylesProvider, jssPreset } from '@mui/styles';
import { create } from 'jss';
import {
  selectCurrentProjectClasses,
  selectCurrentUIFramework,
} from '@Redux/project/selectors/base';
import useProjectHeaderStyles from '@Components/Editor/hooks/useProjectHeaderStyles';
import { DEFAULT_ELEMENTS_STYLES } from '@Domain/libraryElements/defaultStyles';

const Head = () => {
  const uiFramework = useSelector(selectCurrentUIFramework);
  const frameworkVersion = uiFramework?.version;

  return (
    <>
      <style>
        {`
          body {
            margin: 0;
            padding: 0;
          }
          * {
            box-sizing: border-box;
          }
          .react-transform-wrapper {
            max-width: 100%; 
            max-height: 100vh;
            position: relative;
            width: -moz-fit-content;
            width: fit-content;
            height: -moz-fit-content;
            height: fit-content;
            overflow: hidden;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            user-select: none;
            margin: 0;
            padding: 0;
          }
          .react-transform-component {
            display: flex;
            flex-wrap: wrap;
            width: -moz-fit-content;
            width: fit-content;
            height: -moz-fit-content;
            height: fit-content;
            margin: 0;
            padding: 0;
            transform-origin: 0% 0%;
            background-color: #f9f9f9;
            cursor: grab;
          }
        `}
      </style>
      {frameworkVersion && (
        <>
          {frameworkVersion.styleSheetsData.map(
            ({ key, link, ...otherParams }) => (
              <link
                key={key}
                rel="stylesheet"
                type="text/css"
                href={link}
                {...otherParams}
              />
            ),
          )}
          {frameworkVersion.scriptsData.map(({ key, link, ...otherParams }) => (
            <script
              key={key}
              type="text/javascript"
              src={link}
              {...otherParams}
            />
          ))}
          {uiFramework.themeVariables && (
            <style type="text/css">
              {`:root {
              ${Object.keys(uiFramework.themeVariables)
                .map(
                  (varName) =>
                    `--${varName}: ${uiFramework.themeVariables[varName]}`,
                )
                .join(';')}
          }`}
            </style>
          )}
        </>
      )}
    </>
  );
};

const Frame: React.FC = ({ children }) => {
  const entityClassNames = Object.keys(DEFAULT_ELEMENTS_STYLES);
  const projectClasses = useSelector(selectCurrentProjectClasses);

  const entityClasses = useMemo(
    () =>
      projectClasses.filter((classInstance) =>
        entityClassNames.includes(classInstance.className),
      ),
    [projectClasses],
  );

  const sharedClasses = useMemo(
    () =>
      projectClasses.filter(
        (classInstance) => !entityClassNames.includes(classInstance.className),
      ),
    [projectClasses],
  );

  const entityStylesEl = useProjectHeaderStyles(entityClasses);
  const sharedStylesEl = useProjectHeaderStyles(sharedClasses);

  return (
    <FrameComponent
      frameBorder="0"
      width={'100%'}
      height={'100%'}
      id="wireframe-frame"
      head={<Head />}
    >
      <FrameContextConsumer>
        {({ document }) => {
          const cache = createCache({
            key: 'wireframe-frame',
            prepend: true,
            container: document.head,
          });

          const jss = create({
            plugins: [...jssPreset().plugins],
            insertionPoint: document.head,
          });

          document.head.prepend(entityStylesEl);
          document.head.append(sharedStylesEl);

          return (
            <StylesProvider jss={jss}>
              <StyleSheetManager target={document.head}>
                <CacheProvider value={cache}>{children}</CacheProvider>
              </StyleSheetManager>
            </StylesProvider>
          );
        }}
      </FrameContextConsumer>
    </FrameComponent>
  );
};

export default Frame;
