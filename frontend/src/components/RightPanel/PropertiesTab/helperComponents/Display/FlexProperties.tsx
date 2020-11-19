import React from 'react';
import { useSelector } from 'react-redux';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import { FormControlLabel } from '@material-ui/core';
import HeightIcon from '@material-ui/icons/Height';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  Entity,
  LibraryElement,
  PropertiesChangeProps,
} from '../../../../../types';

import withConfigurableProperties from '../../../../../utils/withConfigurableProperties';

import PlaceItemsProperties from './PlaceItemsProperties';
import { selectCurrentEditableStyles } from '../../../../../redux/project/selectors';

const useStyles = makeStyles({
  arrowRotated: {
    transform: 'rotate(90deg)',
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'space-evenly',
  },
});

const FlexProperties: React.FC<PropertiesChangeProps<
  LibraryElement<Entity>
>> = ({ updateStyles }) => {
  const classes = useStyles();
  const flexDirection = useSelector(
    selectCurrentEditableStyles('flexDirection'),
  );
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
      />
    </>
  );
};

export default withConfigurableProperties(FlexProperties);
