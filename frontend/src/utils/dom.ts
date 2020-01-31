import classNames from 'classnames';
import { IScreenMode } from '$components/Editor/Editor/Editor';

export const getClassDevice = (
  styles: { [className: string]: string },
  mode: IScreenMode,
  isPrototype: boolean,
  isRotated: boolean,
  isContainer: boolean,
) => {
  if (isContainer) {
    return classNames(
      {
        [styles.editorWorkContainer_prototype_default]: mode.isDefaultMode
        && isPrototype,
      },
      {
        [styles.editorWorkContainer_prototype_tablet_rotated]: mode.isTabletMode
        && isRotated
        && isPrototype,
        [styles.editorWorkContainer_prototype_tablet]: mode.isTabletMode
        && isPrototype,
      },
      {
        [styles.editorWorkContainer_prototype_mobile_rotated]: mode.isMobileMode
        && isRotated
        && isPrototype,
        [styles.editorWorkContainer_prototype_mobile]: mode.isMobileMode
        && isPrototype,
      },
    );
  }

  return classNames(
    {
      [styles.editorWorkWindow_prototype_default]: mode.isDefaultMode
      && isPrototype,
      [styles.editorWorkWindow_default]: mode.isDefaultMode,
    },
    {
      [styles.editorWorkWindow_prototype_tablet_rotated]: mode.isTabletMode
      && isRotated
      && isPrototype,
      [styles.editorWorkWindow_prototype_tablet]: mode.isTabletMode
      && isPrototype,
      [styles.editorWorkWindow_tablet_rotated]: mode.isTabletMode
      && isRotated,
      [styles.editorWorkWindow_tablet]: mode.isTabletMode,
    },
    {
      [styles.editorWorkWindow_prototype_mobile_rotated]: mode.isMobileMode
      && isRotated
      && isPrototype,
      [styles.editorWorkWindow_prototype_mobile]: mode.isMobileMode
      && isPrototype,
      [styles.editorWorkWindow_mobile_rotated]: mode.isMobileMode
      && isRotated,
      [styles.editorWorkWindow_mobile]: mode.isMobileMode,
    },
  );
};
