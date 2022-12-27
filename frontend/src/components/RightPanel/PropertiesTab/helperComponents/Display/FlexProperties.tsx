import React from 'react';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { FormControlLabel } from '@material-ui/core';
import HeightIcon from '@material-ui/icons/Height';
import { Entity, LibraryElement, PropertiesChangeProps } from '@Src/types';
import { StyledToggleButton } from '@Components/styledComponents';
import { makeStyles } from '@material-ui/core/styles';
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

interface Props {
  updateStyles: PropertiesChangeProps<LibraryElement<Entity>>['updateStyles'];
  flexDirection: React.CSSProperties['flexDirection'];
  justifyContent: React.CSSProperties['justifyContent'];
  alignItems: React.CSSProperties['alignItems'];
  canEdit: boolean;
}

const FlexProperties: React.FC<Props> = ({
  updateStyles,
  flexDirection,
  justifyContent,
  alignItems,
  canEdit,
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
              value={flexDirection}
              defaultValue="initial"
              onChange={handleChangeOrientation}
              exclusive
            >
              <StyledToggleButton value="row" disabled={!canEdit}>
                <HeightIcon className={classes.arrowRotated} />
              </StyledToggleButton>

              <StyledToggleButton value="column" disabled={!canEdit}>
                <HeightIcon />
              </StyledToggleButton>
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
        updateStyles={updateStyles}
        canEdit={canEdit}
      />
    </>
  );
};

export default FlexProperties;
