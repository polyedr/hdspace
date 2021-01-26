import React, { FC } from 'react';
import { Entity, LibraryElement, PropertiesChangeProps } from '@Src/types';

type Props = {
  gridTemplateColumns: React.CSSProperties['gridTemplateColumns'];
  gridTemplateRows: React.CSSProperties['gridTemplateRows'];
};

const GridControl: FC<
  Props & PropertiesChangeProps<LibraryElement<Entity>>
> = ({ gridTemplateColumns, gridTemplateRows }) => {
  return (
    <div>
      {gridTemplateColumns}
      {gridTemplateRows}
    </div>
  );
};

export default GridControl;
