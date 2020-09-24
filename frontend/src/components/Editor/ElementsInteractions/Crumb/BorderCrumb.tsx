import React from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import { AppReduxState } from 'src/shared/types/app';
import {
  selectActiveElementId,
  selectCurrentRootId,
  selectElementById,
  selectShowingBorders,
} from '../../../../redux/project/selectors';
import useBorderStyles from '../hooks/useBorderStyles';

const styles = require('./BorderCrumb.scss');

type Props = {
  elementId: string;
  children?: any;
};

const BorderCrumb: React.FC<Props> = ({ elementId, children }) => {
  const { element, rootID, showBorders, activeElementId } = useSelector(
    (state: AppReduxState) => ({
      element: selectElementById(elementId)(state),
      rootID: selectCurrentRootId(state),
      showBorders: selectShowingBorders(state),
      activeElementId: selectActiveElementId(state),
    }),
  );
  const borderStyles = useBorderStyles(elementId);
  const labelClasses = cn(styles.borderCrumb, styles.borderCrumb_active);
  const showCrumb = showBorders || elementId === activeElementId;

  return element && borderStyles && showCrumb ? (
    <div
      className={labelClasses}
      style={{
        top: borderStyles.top,
        left: elementId === rootID ? 'auto' : borderStyles.left,
        right: elementId === rootID ? borderStyles.right : 'auto',
      }}
    >
      <span
        className={cn(styles.borderLabel)}
        data-label-id={element.id}
        data-element-name={element.name}
      >
        {element.name}
      </span>
      {children}
    </div>
  ) : null;
};

export default BorderCrumb;
