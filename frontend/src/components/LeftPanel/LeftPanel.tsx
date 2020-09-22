import React from 'react';
import cn from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import SubjectIcon from '@material-ui/icons/Subject';
import Navigator from '../Navigator';
import { changeMinLPanel } from '../../redux/user/actions';
import { selectCurrentScreenId } from '../../redux/project/selectors';
import { selectIsLeftPanelMinimized } from '../../redux/user/selectors';

const styles = require('./LeftPanel.scss');

const LeftPanel: React.FC = () => {
  const dispatch = useDispatch();
  const isLPanelMinimized = useSelector(selectIsLeftPanelMinimized);
  const currentScreenId = useSelector(selectCurrentScreenId);

  const handleOpenLPanel = () => {
    dispatch(changeMinLPanel());
  };

  return (
    <aside
      className={cn(styles.leftPanel, isLPanelMinimized && styles.minPanel)}
    >
      {currentScreenId !== -1 &&
        (isLPanelMinimized ? (
          <div
            className={styles.navigationLink}
            onClick={handleOpenLPanel}
            title="Navigator"
          >
            <SubjectIcon />
          </div>
        ) : (
          <Navigator />
        ))}
    </aside>
  );
};

export default LeftPanel;
