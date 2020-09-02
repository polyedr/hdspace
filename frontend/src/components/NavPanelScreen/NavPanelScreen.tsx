import React, { useCallback, memo, useEffect } from 'react';
import classNames from 'classnames';
import Sortable from 'react-sortablejs'; // maybe replace it with react-sortablejs-typescript?
import { useSelector } from 'react-redux';
import * as Actions from '$redux/project/actions';
import { EditorProps } from '$containers/EditorLogic';
import { selectScreens } from '$redux/project/selectors';
import Button from '../UI/Button';
import Icon from '../UI/Icon';
import Scrollbar from '../UI/Scrollbar';
import ScreenButton from './ScreenButton';

const styles = require('./NavPanelScreen.scss');

type Props = {
  screenID?: number;
  isNavPanelMinimized: EditorProps['isNavPanelMinimized'];
  onMinimizerNavPanel(): void;
  projectID: number;
  getProject: typeof Actions.getProject;
  changeScreensOrder: typeof Actions.changeScreensOrder;
  addScreen: typeof Actions.addScreen;
};

const NavPanelScreen: React.FunctionComponent<Props> = ({
  isNavPanelMinimized,
  onMinimizerNavPanel,
  projectID,
  screenID,
  getProject,
  changeScreensOrder,
  addScreen,
}) => {
  const screens = useSelector(selectScreens);

  useEffect(() => {
    getProject(projectID, screenID);
  }, [projectID, getProject]);

  const handleScreenAdd = useCallback(() => {
    addScreen(projectID, `Screen 1`, screens.length);
  }, [projectID, screens]);

  const handleChange = useCallback(
    (order: string[]) => {
      const newScreens = [...screens].map((screen) => {
        const newBuoyancy = order.indexOf(String(screen.id));
        return { ...screen, buoyancy: newBuoyancy };
      });

      changeScreensOrder(newScreens);
    },
    [changeScreensOrder, screens],
  );

  return (
    <div
      className={classNames(
        styles.navPanelContainer,
        isNavPanelMinimized && styles.navPanelContainer_minimize,
      )}
    >
      <div className={styles.navPanelBlock}>
        <Button
          className={classNames('expandBtn', styles.navPanelExpandBtn)}
          styleType="none"
          onClick={onMinimizerNavPanel}
        >
          <Icon icon="expand" size={28} />
        </Button>

        <div className={styles.screensBlock}>
          <Button
            className={classNames(styles.addScreenBtn)}
            styleType="confirm"
            onClick={handleScreenAdd}
          >
            <Icon icon="add" size={16} />
          </Button>

          <Scrollbar autoHeightMin={isNavPanelMinimized ? '38px' : '110px'}>
            <Sortable
              className={styles.screensTabsContainer}
              onChange={handleChange}
            >
              {screens
                .sort((a, b) => a.buoyancy - b.buoyancy)
                .map((screenItem) => (
                  <ScreenButton
                    screen={screenItem}
                    screens={screens}
                    key={screenItem.id}
                  />
                ))}
            </Sortable>
          </Scrollbar>
        </div>
      </div>
    </div>
  );
};

export default memo(NavPanelScreen);
