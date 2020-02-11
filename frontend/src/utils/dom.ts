import classNames from 'classnames';
import { IScreenMode } from '$components/Editor/Editor';

export const getClassDevice = (
  styles: { [className: string]: string },
  mode: IScreenMode,
  isRotated: boolean,
) => {
  return classNames(
    {
      [styles.editorLayout_default]: mode.isDefaultMode,
    },
    {
      [styles.editorLayout_tablet_rotated]: mode.isTabletMode
      && isRotated,
      [styles.editorLayout_tablet]: mode.isTabletMode,
    },
    {
      [styles.editorLayout_mobile_rotated]: mode.isMobileMode
      && isRotated,
      [styles.editorLayout_mobile]: mode.isMobileMode,
    },
  );
};
