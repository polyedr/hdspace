import React from 'react';
import {
  StyledAccordion,
  StyledAccordionSummary,
} from '@Components/styledComponents';
import { makeStyles } from '@material-ui/core/styles';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import AssetLists from './AssetLists';
import DisplayAssets from './DisplayAssets';

const useStyles = makeStyles((theme) => ({
  assetsContainer: {
    display: 'flex',
    flexDirection: 'row',
    height: '300px',
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    backgroundColor: theme.palette.background.paper,
  },

  accordion: {
    width: '100%',
  },
}));

const AssetsSection: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <StyledAccordion square className={classes.accordion}>
        <StyledAccordionSummary expandIcon={<ExpandLessIcon />}>
          Project assets
        </StyledAccordionSummary>
        <AssetLists />
        <DisplayAssets />
      </StyledAccordion>
    </div>
  );
};

export default AssetsSection;
