import classNames from 'classnames';
import { IScreenMode } from '$components/Editor/Editor';

export const getClassDevice = (
  styles: { [className: string]: string },
  mode: IScreenMode,
  isRotated: boolean,
) => {
  return classNames(
    {
      [styles.editorWorkWindow_default]: mode.isDefaultMode,
    },
    {
      [styles.editorWorkWindow_tablet_rotated]: mode.isTabletMode
      && isRotated,
      [styles.editorWorkWindow_tablet]: mode.isTabletMode,
    },
    {
      [styles.editorWorkWindow_mobile_rotated]: mode.isMobileMode
      && isRotated,
      [styles.editorWorkWindow_mobile]: mode.isMobileMode,
    },
  );
};
