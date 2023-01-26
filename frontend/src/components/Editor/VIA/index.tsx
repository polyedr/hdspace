// @ts-nocheck
import { makeStyles } from '@mui/styles';
import {
  copyVIARegion,
  deleteVIARegion,
  executeRedoActions,
  executeUndoActions,
  pasteVIARegion,
  setActiveVIARegion,
} from '@Redux/project/actions';
import { useHotkeys as useShortcut } from 'react-hotkeys-hook';
import {
  selectAnnotatedImageFile,
  selectVIARegionsAsArray,
} from '@Redux/project/selectors/via';
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Region from './Region';

const useStyles = makeStyles({
  viaRoot: {
    padding: '0.5em',
    flex: '1 1',
    flexDirection: 'column',
    overflow: 'auto',
    display: 'block',
  },
  canvas: {
    position: 'relative',
    minHeight: '100%',
  },
});

const VIA: FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const regions = useSelector(selectVIARegionsAsArray);
  const annotatedImageFile = useSelector(selectAnnotatedImageFile);
  const url = URL.createObjectURL(annotatedImageFile?.file);

  const handleCopy = () => {
    dispatch(copyVIARegion());
  };

  const handlePaste = () => {
    dispatch(pasteVIARegion());
  };

  const handleDelete = () => {
    dispatch(deleteVIARegion());
  };

  const handleUndo = () => {
    dispatch(executeUndoActions());
  };

  const handleRedo = () => {
    dispatch(executeRedoActions());
  };

  useShortcut('ctrl+c, command+c', handleCopy);
  useShortcut('ctrl+v, command+v', handlePaste);
  useShortcut('ctrl+z, command+z', handleUndo);
  useShortcut('ctrl+shift+z, command+shift+z', handleRedo);
  useShortcut('delete, command+backspace', handleDelete);

  const handleClick = () => dispatch(setActiveVIARegion('', false));

  return (
    <div className={classes.viaRoot}>
      <div onClick={handleClick} className={classes.canvas}>
        <img src={url} alt="annotated" />

        {regions.map((region) => (
          <Region key={region.id} region={region} />
        ))}
      </div>
    </div>
  );
};

export default VIA;
