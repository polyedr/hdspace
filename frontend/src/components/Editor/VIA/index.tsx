import { makeStyles } from '@material-ui/core';
import { selectVIARegions } from '@Redux/project/selectors/base';
import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import Region from './Region';

const useStyles = makeStyles({
  root: {
    padding: '0.5em',
    flex: '1 1',
  },
});

const VIA: FC = () => {
  const classes = useStyles();

  const regions = useSelector(selectVIARegions);
  return (
    <div className={classes.root}>
      {regions.map((region) => (
        <Region key={region.id} region={region} />
      ))}
    </div>
  );
};

export default VIA;
