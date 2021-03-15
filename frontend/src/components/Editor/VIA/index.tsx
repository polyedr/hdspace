import { makeStyles } from '@material-ui/core';
import { setActiveVIARegion } from '@Redux/project/actions';
import { selectVIARegionsAsArray } from '@Redux/project/selectors/base';
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Region from './Region';

const useStyles = makeStyles({
  root: {
    padding: '0.5em',
    flex: '1 1',
  },
});

const VIA: FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleClick = () => dispatch(setActiveVIARegion(''));

  const regions = useSelector(selectVIARegionsAsArray);
  return (
    <div className={classes.root} onClick={handleClick}>
      {regions.map((region) => (
        <Region key={region.id} region={region} />
      ))}
    </div>
  );
};

export default VIA;
