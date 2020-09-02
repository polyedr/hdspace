import React, { useCallback } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { DEFAULT_SCREEN_MODE } from '$constants/defaultParams';
import { ScreenMode } from '../Workspace/Workspace';
import { redoAction, undoAction } from '$redux/project/actions';
import { selectors } from '$redux/project';
import Button from '../../UI/Button';
import Icon from '../../UI/Icon';
import Checkbox from '../../UI/Checkbox';

const styles = require('./TopBar.scss');

export type IScreenMode = {
  isDefaultMode: boolean;
  isTabletMode: boolean;
  isMobileMode: boolean;
};

type Props = {
  screenID: number;
  isPrototypeMode: boolean;
  isScreenRotated: boolean;
  screenMode: any;
  onPrototypeModeToggle(value: boolean): void;
  onScreenModeChange(value: ScreenMode): void;
  onScreenRotate(isRotated: boolean): void;
  onScreenSave(): void;
  onExport(): void;
};

export const TopBar = ({
  screenID,
  isPrototypeMode,
  isScreenRotated,
  screenMode,
  onPrototypeModeToggle,
  onScreenSave,
  onScreenModeChange,
  onScreenRotate,
  onExport,
}: Props) => {
  const dispatch = useDispatch();

  const undoLength = useSelector(selectors.selectUndoActions).length;
  const redoLength = useSelector(selectors.selectRedoActions).length;

  const onHistoryBack = () => {
    dispatch(undoAction());
  };

  const onHistoryForward = () => {
    dispatch(redoAction());
  };

  const handleDefaultScreenModeSelect = useCallback(() => {
    onScreenModeChange({ ...DEFAULT_SCREEN_MODE, isDefaultMode: true });
    onScreenRotate(false);
  }, [onScreenModeChange, onScreenRotate]);

  const handleTabletScreenModeSelect = useCallback(() => {
    onScreenModeChange({ ...DEFAULT_SCREEN_MODE, isTabletMode: true });
  }, [onScreenModeChange]);

  const handleMobileScreenModeSelect = useCallback(() => {
    onScreenModeChange({ ...DEFAULT_SCREEN_MODE, isMobileMode: true });
  }, [onScreenModeChange]);

  const handleScreenRotate = useCallback(() => {
    onScreenRotate(!isScreenRotated);
  }, [isScreenRotated, onScreenRotate]);

  const handlePrototypeModeToggle = useCallback(() => {
    onPrototypeModeToggle(!isPrototypeMode);
  }, [isPrototypeMode, onPrototypeModeToggle]);

  return (
    <div className={classNames(styles.editorNavBar)}>
      <div className={styles.navBarTypeScreenBlock}>
        <Button
          className={classNames(
            'mainImgBtn',
            styles.navBarBtn,
            screenMode.isDefaultMode && styles.navBarBtn_active,
          )}
          styleType="none"
          disabled={screenID === -1}
          onClick={handleDefaultScreenModeSelect}
        >
          <Icon icon="computer" size={32} />
        </Button>
        <Button
          className={classNames(
            'mainImgBtn',
            styles.navBarBtn,
            screenMode.isTabletMode && styles.navBarBtn_active,
          )}
          styleType="none"
          disabled={screenID === -1}
          onClick={handleTabletScreenModeSelect}
        >
          <Icon icon="table" />
        </Button>
        <Button
          className={classNames(
            'mainImgBtn',
            styles.navBarBtn,
            screenMode.isMobileMode && styles.navBarBtn_active,
          )}
          styleType="none"
          disabled={screenID === -1}
          onClick={handleMobileScreenModeSelect}
        >
          <Icon icon="phone" />
        </Button>
        {(screenMode.isTabletMode || screenMode.isMobileMode) && (
          <Button
            className={classNames(
              'mainImgBtn',
              styles.navBarBtn,
              styles.rotateScreenBtn,
              isScreenRotated && styles.rotateScreenBtn_active,
            )}
            styleType="none"
            disabled={screenID === -1}
            onClick={handleScreenRotate}
          >
            <Icon icon="screen-rotate" />
          </Button>
        )}
      </div>
      <div className="navBarModeBlock">
        <Checkbox
          name="isPrototypeMode"
          label={isPrototypeMode ? 'ON' : 'OFF'}
          className={classNames(
            styles.prototypeModeIndicator,
            !isPrototypeMode && styles.prototypeModeIndicator_off,
          )}
          checked={isPrototypeMode}
          disabled={screenID === -1}
          isHidden
          onChange={handlePrototypeModeToggle}
        />
        <span>Prototype Mode</span>
        {/* <span>Active element ID: {`${activeItem.itemId}-${activeItem.itemType}-where parent is-${activeItem.parentId}-and-scenario-id-${activeItem.scenarioId}`}</span> */}
      </div>
      <div className={styles.navBarStateControlBlock}>
        <Button
          className={classNames('mainImgBtn', styles.navBarBtn)}
          styleType="none"
          disabled={screenID === -1 || !undoLength}
          onClick={onHistoryBack}
        >
          <Icon icon="undo" />
        </Button>
        <Button
          className={classNames('mainImgBtn', styles.navBarBtn)}
          styleType="none"
          disabled={screenID === -1 || !redoLength}
          onClick={onHistoryForward}
        >
          <Icon icon="redo" />
        </Button>
        <Button
          className={classNames('mainImgBtn', styles.navBarBtn)}
          styleType="none"
          onClick={onScreenSave}
          disabled={screenID < 1}
        >
          <Icon icon="save" size={28} />
        </Button>
        <Button
          className={classNames('mainImgBtn', styles.navBarBtn)}
          styleType="none"
          onClick={onExport}
          disabled={screenID < 1}
        >
          <Icon icon="download" size={28} />
        </Button>
      </div>
    </div>
  );
};
