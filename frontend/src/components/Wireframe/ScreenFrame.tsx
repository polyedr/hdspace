import React, { useMemo } from 'react';
import { CustomHead } from '@Components/Editor/FrameWrapper';
import useProjectHeaderStyles from '@Components/Editor/hooks/useProjectHeaderStyles';
import { DEFAULT_ELEMENTS_STYLES } from '@Domain/libraryElements/defaultStyles';
import { selectCurrentProjectClasses } from '@Redux/project/selectors/base';
import { theme } from '@Src/styles/Theme';
import { ThemeProvider } from '@mui/material';
import { StylesProvider, jssPreset } from '@mui/styles';
import { create } from 'jss';

import FrameComponent, { FrameContextConsumer } from 'react-frame-component';
import { useSelector } from 'react-redux';
import { SCREEN_WIDTH } from './constants';

const entityClassNames = Object.keys(DEFAULT_ELEMENTS_STYLES);

const ScreenFrame: React.FC = ({ children }) => {
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
    <div
      className="wireframe-screen-frame"
      style={{ width: SCREEN_WIDTH, overflow: 'scroll' }}
    >
      {children}
    </div>
  );

  // return (
  //   <FrameComponent
  //     head={<CustomHead />}
  //     frameBorder={0}
  //     width={400}
  //     height={600}
  //   >
  //     <FrameContextConsumer>
  //       {({ document: frameDocument }) => {
  //         const jss = create({
  //           plugins: [...jssPreset().plugins],
  //           insertionPoint: frameDocument.head,
  //         });

  //         frameDocument.head.prepend(entityStylesEl);
  //         frameDocument.head.append(sharedStylesEl);

  //         return (
  //           <StylesProvider jss={jss}>
  //             <ThemeProvider theme={theme}>{children}</ThemeProvider>
  //           </StylesProvider>
  //         );
  //       }}
  //     </FrameContextConsumer>
  //   </FrameComponent>
  // );
};

export default ScreenFrame;
