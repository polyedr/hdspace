import { StyledIconButton } from '@Components/styledComponents';
import { Button, makeStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { assembleVIARegions, createVIARegion } from '@Redux/project/actions';
import { selectActiveVIARegion } from '@Redux/project/selectors/via';
import { RIGHT_PANEL_WIDTH } from '@Src/styles/Theme';
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import VIADescription from './VIADescription';

const useStyles = makeStyles(({ palette, spacing }) => ({
  root: {
    width: RIGHT_PANEL_WIDTH,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: palette.panel.main,
    color: palette.common.white,
    overflow: 'hidden',
    padding: spacing(2),
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const VIARightPanel: FC = () => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const region = useSelector(selectActiveVIARegion);

  const handleCreateRegion = () => dispatch(createVIARegion());

  const handleAssemble = () => dispatch(assembleVIARegions());

  return (
    <div className={classes.root}>
      {region && <VIADescription region={region} />}

      <div>
        <StyledIconButton title="Create a region" onClick={handleCreateRegion}>
          <AddIcon />
        </StyledIconButton>
      </div>

      <div className={classes.buttonContainer}>
        <Button variant="contained" color="secondary" onClick={handleAssemble}>
          Assemble
        </Button>
      </div>
    </div>
  );
};

export default VIARightPanel;
