import React from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  selectActiveElementId,
  selectCurrentRootId,
  selectElementById,
} from '@Redux/project/selectors/element';
import { selectShowingBorders } from '@Redux/project/selectors/base';
import { BorderStyles } from '@Src/types';
import {
  selectActiveMasterElementId,
  selectMasterElementById,
  selectMasterScreenEnabled,
} from '@Redux/project/selectors/masterScreen';
import { ELEMENTS_WITHOUT_CRUMB } from '../constants';

type Props = {
  elementId: string;
  styles: BorderStyles;
  children?: any;
};

const useStyles = makeStyles((theme) => ({
  crumb: ({ styles, elementId, rootId }: Props & { rootId: string }) => ({
    top: elementId === rootId ? styles.top : styles.top + styles.height - 1,
    left: elementId === rootId ? 'auto' : styles.left,
    right: elementId === rootId ? styles.right : 'auto',
    zIndex: 9999999,
    position: 'absolute',
    padding: '2px 4px',
    fontSize: '12px',
    lineHeight: 1,
    color: theme.palette.common.white,
    background: '#5A899D',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  }),
  label: {
    display: 'block',
    padding: '0 3px',
  },
}));

const BorderCrumb: React.FC<Props> = (props) => {
  const { elementId, children } = props;
  const masterScreenEnabled = useSelector(selectMasterScreenEnabled);
  const masterElement = useSelector(selectMasterElementById(elementId));
  const stateElement = useSelector(selectElementById(elementId));

  const stateRootId = useSelector(selectCurrentRootId);
  const showBorders = useSelector(selectShowingBorders);
  const activeElementId = useSelector(selectActiveElementId);
  const activeMasterElementId = useSelector(selectActiveMasterElementId);

  const rootId = masterScreenEnabled ? 'masterRoot' : stateRootId;
  const element = masterScreenEnabled ? masterElement : stateElement;
  const activeId = masterScreenEnabled
    ? activeMasterElementId
    : activeElementId;

  const classes = useStyles({
    ...props,
    rootId,
  });

  const showCrumb =
    !ELEMENTS_WITHOUT_CRUMB.includes(element.type) &&
    (showBorders || elementId === activeId);

  return element && showCrumb ? (
    <div className={cn(classes.crumb)}>
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
