import React, { useRef, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import {
  selectCurrentProjectClasses,
  selectEditorDocument,
} from '@Redux/project/selectors/base';
import { DEFAULT_ELEMENTS_STYLES } from '@Domain/libraryElements/defaultStyles';
import useHotKeys from '../hooks/useHotKeys';
import useProjectHeaderStyles from '../hooks/useProjectHeaderStyles';

import 'css-ripple-effect/dist/ripple.min.css';
// eslint-disable-next-line import/order
import useGlobalDropTarget from '@Utils/dragAndDrop/GlobalDropTarget/useGlobalDropTarget';

const entityClassNames = Object.keys(DEFAULT_ELEMENTS_STYLES);

const useStyles = makeStyles(() =>
  createStyles({
    editorViewport: {
      position: 'relative',
      display: 'flex',
      flexGrow: 1,
      justifyContent: 'center',
      '&:focus': {
        outline: 0,
      },
    },
  }),
);

const Viewport: React.FC = ({ children }) => {
  const projectClasses = useSelector(selectCurrentProjectClasses);
  const editorDocument = useSelector(selectEditorDocument);

  const sharedClasses = useMemo(() => {
    return projectClasses.filter(
      (classInstance) => !entityClassNames.includes(classInstance.className),
    );
  }, [projectClasses]);

  const entityClasses = useMemo(() => {
    return projectClasses.filter((classInstance) =>
      entityClassNames.includes(classInstance.className),
    );
  }, [projectClasses]);

  const styles = useStyles();

  const ref = useRef<HTMLDivElement>(null);

  useHotKeys(ref);

  const sharedStylesEl = useProjectHeaderStyles(sharedClasses);
  const entityStylesEl = useProjectHeaderStyles(entityClasses);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (editorDocument) {
      editorDocument.head.prepend(entityStylesEl);
      editorDocument.head.append(sharedStylesEl);
    }
  }, [editorDocument, entityStylesEl, sharedStylesEl]);

  useGlobalDropTarget(
    ['smartHeader', 'smartFooter', 'smartForm', 'smartWebpage'],
    ref,
  );

  return (
    <div ref={ref} className={styles.editorViewport} tabIndex={-1}>
      {children}
    </div>
  );
};

export default Viewport;
