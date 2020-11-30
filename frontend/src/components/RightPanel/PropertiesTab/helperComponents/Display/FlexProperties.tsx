import React from 'react';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import { FormControlLabel } from '@material-ui/core';
import HeightIcon from '@material-ui/icons/Height';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Entity, LibraryElement, PropertiesChangeProps } from '@Src/types';

import withConfigurableProperties from '@Utils/withConfigurableProperties';

import PlaceItemsProperties from './PlaceItemsProperties';

const useStyles = makeStyles({
  arrowRotated: {
    transform: 'rotate(90deg)',
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'space-evenly',
  },
});

type Props = PropertiesChangeProps<LibraryElement<Entity>> & {
  flexDirection: React.CSSProperties['flexDirection'];
  justifyContent: React.CSSProperties['justifyContent'];
  alignItems: React.CSSProperties['alignItems'];
};

const FlexProperties: React.FC<Props> = ({
  updateStyles,
  flexDirection,
  justifyContent,
  alignItems,
}) => {
  const classes = useStyles();
  const handleChangeOrientation = (ev, newOrientation) => {
    if (!newOrientation) return;
    updateStyles({ flexDirection: newOrientation });
  };

  return (
    <>
      <div className={classes.wrapper}>
        <FormControlLabel
          label="Direction"
          labelPlacement="top"
          control={
            <ToggleButtonGroup
              size="small"
              value={flexDirection || 'initial'}
              onChange={handleChangeOrientation}
              exclusive
            >
              <ToggleButton value="row">
                <HeightIcon className={classes.arrowRotated} />
              </ToggleButton>

              <ToggleButton value="column">
                <HeightIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          }
        />
      </div>
      <PlaceItemsProperties
        reversed={
          !!flexDirection && (flexDirection as string).startsWith('column')
        }
        justifyContent={justifyContent}
        alignItems={alignItems}
      />
    </>
  );
};

export default withConfigurableProperties(FlexProperties);
