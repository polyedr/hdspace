import React from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import {
  selectActiveElementId,
  selectCurrentRootId,
  selectElementById,
  selectShowingBorders,
} from '../../../../redux/project/selectors';
import { BorderStyles } from '../ElementsInteractions';

const css = require('./BorderCrumb.scss');

type Props = {
  elementId: string;
  styles: BorderStyles;
  children?: any;
};

const BorderCrumb: React.FC<Props> = ({ elementId, styles, children }) => {
  const element = useSelector(selectElementById(elementId));
  const rootID = useSelector(selectCurrentRootId);
  const showBorders = useSelector(selectShowingBorders);
  const activeElementId = useSelector(selectActiveElementId);

  const labelClasses = cn(css.borderCrumb, css.borderCrumb_active);
  const showCrumb = showBorders || elementId === activeElementId;

  return element && showCrumb ? (
    <div
      className={labelClasses}
      style={{
        top: styles.top,
        left: elementId === rootID ? 'auto' : styles.left,
        right: elementId === rootID ? styles.right : 'auto',
      }}
    >
      <span
        className={cn(css.borderLabel)}
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
