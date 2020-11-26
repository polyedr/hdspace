import React from 'react';
import { useSelector } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  selectActiveElementId,
  selectCurrentRootId,
  selectElementById,
} from '@Redux/project/selectors/element';
import { selectShowingBorders } from '@Redux/project/selectors/base';
import { BorderStyles } from '@Src/types';
import { ELEMENTS_WITHOUT_CRUMB } from '../constants';

type Props = {
  elementId: string;
  styles: BorderStyles;
  children?: any;
};

const useStyles = makeStyles((theme) => ({
  crumb: {
    position: 'absolute',
    padding: '2px 4px',
    fontSize: '12px',
    lineHeight: 1,
    color: theme.palette.common.white,
    background: '#5A899D',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 3,
  },
  label: {
    display: 'block',
    padding: '0 3px',
  },
}));

const BorderCrumb: React.FC<Props> = ({ elementId, styles, children }) => {
  const classes = useStyles();
  const element = useSelector(selectElementById(elementId));
  const rootID = useSelector(selectCurrentRootId);
  const showBorders = useSelector(selectShowingBorders);
  const activeElementId = useSelector(selectActiveElementId);

  const showCrumb =
    !ELEMENTS_WITHOUT_CRUMB.includes(element.type) &&
    (showBorders || elementId === activeElementId);

  return element && showCrumb ? (
    <div
      className={classes.crumb}
      style={{
        top: elementId === rootID ? styles.top : styles.top + styles.height - 1,
        left: elementId === rootID ? 'auto' : styles.left,
        right: elementId === rootID ? styles.right : 'auto',
        zIndex: 9999999,
      }}
    >
      <span
        className={classes.label}
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
