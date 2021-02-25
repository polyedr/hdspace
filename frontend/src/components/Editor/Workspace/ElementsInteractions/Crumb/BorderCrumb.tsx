import React, { useCallback } from 'react';
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import cn from 'classnames';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  selectActiveElementId,
  selectCurrentRootId,
  selectElementById,
} from '@Redux/project/selectors/element';
import {
  selectCurrentProjectId,
  selectShowingBorders,
} from '@Redux/project/selectors/base';
import { BorderStyles } from '@Src/types';
import { selectMasterScreenId } from '@Redux/project/selectors/screen';
import { setActiveElement } from '@Redux/project/actions';
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
}));

const BorderCrumb: React.FC<Props> = (props) => {
  const { elementId, children } = props;
  const element = useSelector(selectElementById(elementId));

  const rootId = useSelector(selectCurrentRootId);
  const showBorders = useSelector(selectShowingBorders);
  const activeElementId = useSelector(selectActiveElementId);
  const currentProjectId = useSelector(selectCurrentProjectId);
  const masterScreenId = useSelector(selectMasterScreenId);

  const history = useHistory();

  const dispatch = useDispatch();

  const classes = useStyles({
    ...props,
    rootId,
  });

  const showCrumb =
    !ELEMENTS_WITHOUT_CRUMB.includes(element.type) &&
    (showBorders || elementId === activeElementId);

  const handleSourceElementClick = useCallback(() => {
    history.push(`/project/${currentProjectId}/${masterScreenId}`);
    dispatch(setActiveElement(element.parameters.sourceElementId));
  }, [
    currentProjectId,
    dispatch,
    element.parameters.sourceElementId,
    history,
    masterScreenId,
  ]);

  return element && showCrumb ? (
    <div className={cn(classes.crumb)}>
      <span
        className={classes.label}
        data-label-id={element.id}
        data-element-name={element.name}
      >
        {element.name}
      </span>
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

export default BorderCrumb;
