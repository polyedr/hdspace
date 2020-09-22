import React, { memo, useState, useEffect } from 'react';
import cn from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import Workspace from './Workspace/Workspace';
import { selectIsNavPanelMinimized } from '../../redux/user/selectors';
import { selectCurrentScreenId } from '../../redux/project/selectors';
import { resetScreenState } from '../../redux/project/actions';

const styles = require('./Editor.scss');

export interface IScreenMode {
  isDefaultMode: boolean;
  isTabletMode: boolean;
  isMobileMode: boolean;
}

const Editor: React.FC = () => {
  const dispatch = useDispatch();
  const isNavPanelMinimized = useSelector(selectIsNavPanelMinimized);
  const currentScreenId = useSelector(selectCurrentScreenId);

  const [screenId, setScreenId] = useState<number>(-1);

  useEffect(() => {
    if (currentScreenId !== screenId) {
      setScreenId(currentScreenId);
    }
  }, [currentScreenId]);

  useEffect(
    () => () => {
      dispatch(resetScreenState());
    },
    [],
  );

  return (
    <div
      className={cn(
        styles.editorContainer,
        isNavPanelMinimized && styles.editorContainer_minimized,
      )}
    >
      <Workspace />
    </div>
  );
};

export default memo(Editor);
