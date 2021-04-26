import React, { memo, useCallback } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import cn from 'classnames';
import { BorderStyles, StateElement } from '@Src/types';
import { setMasterSourceElementId } from '@Redux/project/actions';
import { makeStyles } from '@material-ui/core/styles';

type Props = {
  element: StateElement;
  show: boolean;
  currentProjectId: number;
  rootId: string;
  styles: BorderStyles;
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
}));

const BorderCrumb: React.FC<Props> = (props) => {
  const { element, children, show, currentProjectId, masterScreenId } = props;

  const dispatch = useDispatch();

  const history = useHistory();

  const classes = useStyles(props);

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

  return element && show ? (
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

export default memo(BorderCrumb);
