import { StyledIconButton } from '@Components/styledComponents';
import { Button, Theme } from '@mui/material';
import {
  Add as AddIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import {
  assembleVIARegions,
  cancelRecognizing,
  createVIARegion,
  pasteVIARegion,
} from '@Redux/project/actions';
import {
  selectActiveVIARegion,
  selectCopiedVIARegion,
} from '@Redux/project/selectors/via';
import { RIGHT_PANEL_WIDTH } from '@Src/styles/Theme';
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@mui/styles';
import VIADescription from './VIADescription';

const useStyles = makeStyles<Theme>(({ palette, spacing }) => ({
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
    '& > *': {
      margin: spacing(0, 0.5),
    },
  },
}));

const VIARightPanel: FC = () => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const region = useSelector(selectActiveVIARegion);
  const copiedRegion = useSelector(selectCopiedVIARegion);

  const handleCreateRegion = () => dispatch(createVIARegion());

  const handlePasteRegion = () => dispatch(pasteVIARegion());

  const handleAssemble = () => dispatch(assembleVIARegions());

  const handleCancel = () => dispatch(cancelRecognizing());

  return (
    <div className={classes.root}>
      {region && <VIADescription region={region} />}

      <div>
        <StyledIconButton title="Create a region" onClick={handleCreateRegion}>
          <AddIcon />
        </StyledIconButton>

        <StyledIconButton
          title="Paste a region"
          onClick={handlePasteRegion}
          disabled={!copiedRegion}
        >
          <AssignmentIcon />
        </StyledIconButton>
      </div>

      <div className={classes.buttonContainer}>
        <Button variant="contained" color="secondary" onClick={handleAssemble}>
          Assemble
        </Button>

        <Button onClick={handleCancel}>Cancel</Button>
      </div>
    </div>
  );
};

export default VIARightPanel;
