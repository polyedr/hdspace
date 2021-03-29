import { makeStyles } from '@material-ui/core';
import {
  copyVIARegion,
  deleteVIARegion,
  pasteVIARegion,
  setActiveVIARegion,
} from '@Redux/project/actions';
import { useHotkeys as useShortcut } from 'react-hotkeys-hook';
import {
  selectAnnotatedImageURL,
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
  const annotatedImageURL = useSelector(selectAnnotatedImageURL);

  const handleCopy = () => {
    dispatch(copyVIARegion());
  };

  const handlePaste = () => {
    dispatch(pasteVIARegion());
  };

  const handleDelete = () => {
    dispatch(deleteVIARegion());
  };

  useShortcut('ctrl+c, command+c', handleCopy);
  useShortcut('ctrl+v, command+v', handlePaste);
  useShortcut('delete, backspace', handleDelete);

  const handleClick = () => dispatch(setActiveVIARegion(''));

  return (
    <div className={classes.viaRoot}>
      <div onClick={handleClick} className={classes.canvas}>
        <img src={annotatedImageURL} alt="annotated" />

        {regions.map((region) => (
          <Region key={region.id} region={region} />
        ))}
      </div>
    </div>
  );
};

export default VIA;
