import { Normalized, Screen as ProjectScren } from '@Src/types';
import { GRID_CELL_SPACE, GRID_STROKE_WIDTH } from '@Constants/grid';

export type WireframeScreen = ProjectScren & {
  position: { x: number; y: number };
};

export type Screens = Normalized<WireframeScreen>;

export function calculateCanvasSize(count: number, size: number) {
  return size * count * 10;
}

export function buildScreenData(
  _screens: Normalized<ProjectScren>,
  width: number,
  height: number,
): Screens {
  const screens = {};

  const validScreens = Object.values(_screens).filter(
    (s) => !s.name.includes('Master'),
  );

  const canvasWidth = calculateCanvasSize(
    Object.values(validScreens).length,
    width,
  );
  const canvasHeight = calculateCanvasSize(
    Object.keys(validScreens).length,
    height,
  );

  let index = 0;

  Object.entries(_screens).forEach(([key, screen]) => {
    if (screen.name.includes('Master')) {
      return;
    }

    screens[key] = {
      ...screen,
      position: {
        x:
          Math.round(
            (screen.screenData?.wireframePosition?.x ??
              canvasWidth / 2 - (width + 100) * index) / GRID_CELL_SPACE,
          ) *
            GRID_CELL_SPACE +
          GRID_STROKE_WIDTH / 2,
        y:
          Math.round(
            (screen.screenData?.wireframePosition?.y ??
              canvasHeight / 2 - height / 2) * GRID_CELL_SPACE,
          ) /
            GRID_CELL_SPACE +
          GRID_STROKE_WIDTH / 2,
      },
    };

    index++;
  });

  return screens;
}
