import { makeStyles } from '@material-ui/core';
import { setActiveVIARegion } from '@Redux/project/actions';
import {
  selectAnnotatedElement,
  selectVIARegionsAsArray,
} from '@Redux/project/selectors/via';
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Region from './Region';

const useStyles = makeStyles({
  root: {
    padding: '0.5em',
    flex: '1 1',
  },
  canvas: {
    position: 'relative',
  },
});

const VIA: FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const regions = useSelector(selectVIARegionsAsArray);
  const annotatedElement = useSelector(selectAnnotatedElement);

  if (!annotatedElement) return null;

  const handleClick = () => dispatch(setActiveVIARegion(''));

  return (
    <div className={classes.root}>
      <div onClick={handleClick} className={classes.canvas}>
        <img src={annotatedElement.parameters.imageURL} alt="annotated" />

        {regions.map((region) => (
          <Region key={region.id} region={region} />
        ))}
      </div>
    </div>
  );
};

export default VIA;
