import React, { memo, useCallback } from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';
import { BoundingStyles, StateElement } from '@Src/types/types';
import {
  setMasterSourceElementId,
  copyActiveElement,
  deleteElement,
  pasteCopiedElement,
  setActiveElement,
} from '@Redux/project/actions';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';

import { makeStyles } from '@material-ui/core/styles';
import Icon from '../../../../UI/Icon';

type Props = {
  element: StateElement;
  show: boolean;
  currentProjectId: number;
  rootId: string;
  styles: BoundingStyles;
  children?: any;
  masterScreenId: number | null;
};

const useStyles = makeStyles((theme) => ({
  crumb: ({ styles, element, rootId }: Props & { rootId: string }) => ({
    top: element.id === rootId ? styles.top : styles.top + styles.height - 1,
    left: element.id === rootId ? 'auto' : styles.left,
    right: element.id === rootId ? styles.right : 'auto',
    zIndex: 9999999,
    fontFamily: 'Roboto',
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
  sourceLabel: {
    padding: '0 3px',
    cursor: 'pointer',
    '&:before': {
      content: '|',
    },
  },
  separator: {
    margin: '0 3px',
  },
  icon: {
    cursor: 'pointer',
    paddingTop: '1px',
  },
}));

const BorderCrumb: React.FC<Props> = (props) => {
  const { element, children, show, currentProjectId, masterScreenId } = props;

  const dispatch = useDispatch();

  const history = useHistory();

  const classes = useStyles(props);

  const currentScreenId = useSelector(selectCurrentScreenId);

  const handleSourceElementClick = useCallback(() => {
    dispatch(setMasterSourceElementId(element.parameters.sourceElementId));
    history.push(`/project/${currentProjectId}/${masterScreenId}`);
  }, [
    currentProjectId,
    dispatch,
    element.parameters.sourceElementId,
    history,
    masterScreenId,
  ]);

  const handleDelete = () => {
    dispatch(deleteElement(element.id, { screenId: currentScreenId }));
  };

  const handleDuplicate = () => {
    dispatch(copyActiveElement());
    dispatch(setActiveElement(String(element.parent)));
    dispatch(pasteCopiedElement({ screenId: currentScreenId }));
  };
  return element && show ? (
    <div className={cn(classes.crumb)}>
      <span
        className={classes.label}
        data-label-id={element.id}
        data-element-name={element.name}
      >
        {element.name}
      </span>
      {element.type !== 'root' && element.name.indexOf('Master') < 0 && (
        <>
          <span className={classes.icon} onClick={handleDuplicate}>
            <Icon icon="copy" size={16} color="white" />
          </span>
          <span className={classes.icon} onClick={handleDelete}>
            <Icon icon="delete" size={16} color="white" />
          </span>
        </>
      )}

      {element.parameters.sourceElementId && (
        <>
          <span className={classes.separator}>|</span>
          <span
            className={classes.sourceLabel}
            onClick={() => handleSourceElementClick()}
          >
            source
          </span>
        </>
      )}
      {children}
    </div>
  ) : null;
};

export default memo(BorderCrumb);
