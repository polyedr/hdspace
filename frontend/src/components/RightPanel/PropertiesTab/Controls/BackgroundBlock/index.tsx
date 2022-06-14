import React, { memo } from 'react';
import {
  Entity,
  LibraryElement,
  PropertiesChangeProps,
  ElementTypeName,
} from '@Src/types';
import { useDebouncedValueChange } from '@Utils/debounceHooks';
import { makeStyles } from '@material-ui/core/styles';
import ColorSettings from '../../helperComponents/ColorSettings';

type Props = PropertiesChangeProps<LibraryElement<Entity>> & {
  backgroundColor?: React.CSSProperties['backgroundColor'];
  controlName?: string;
};

const useStyles = makeStyles({
  root: {
    padding: '0 16px',
  },
});

const BackgroundBlock: React.FC<Props> = ({
  removeStyles,
  updateStyles,
  element,
  backgroundColor = 'transparent',
  canEdit,
}) => {
  const classes = useStyles();
  const [color, handleColorChange] = useDebouncedValueChange(
    backgroundColor,
    (updatedColorValue: string) => {
      updateStyles(
        element.name === ElementTypeName.ROOT
          ? {
              backgroundColor: updatedColorValue,
              width: 'auto',
              height: 'auto',
            }
          : {
              backgroundColor: updatedColorValue,
            },
      );
    },
  );

  return (
    <div className={classes.root}>
      <ColorSettings
        onClick={removeStyles}
        propsToRemove={['backgroundColor']}
        currentColor={color as string}
        activeElementId={element.id}
        onChange={handleColorChange as (color: string) => any}
        disabled={!canEdit}
      />
    </div>
  );
};

export default memo(BackgroundBlock);
