import { selectVIARegions } from '@Redux/project/selectors/base';
import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import AtlasTree, { RenderItemParams, TreeData } from '@atlaskit/tree';
import { Normalized, VIARegion } from '@Src/types';
import { makeStyles } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
} from '@Components/styledComponents';
import VIATreeItem from './VIATreeItem';

const convertVIAToTree = (viaRegions: Normalized<VIARegion>): TreeData => ({
  rootId: 'via-tree-root',
  items: {
    'via-tree-root': {
      id: 'via-tree-root',
      children: Object.keys(viaRegions),
      isExpanded: true,
      data: {
        id: 'via-tree-root',
      },
      hasChildren: true,
    },
    ...Object.fromEntries(
      Object.entries(viaRegions).map(([id, region]) => [
        id,
        {
          id: region.id,
          children: [],
          hasChildren: false,
          isExpanded: false,
          data: {
            id: region.id,
            type: region.region_attributes['HTML element'],
          },
        },
      ]),
    ),
  },
});

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    padding: spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItem: 'stretch',
  },
}));

const VIANavigator: FC = () => {
  const classes = useStyles();
  const viaRegions = useSelector(selectVIARegions);

  const tree = convertVIAToTree(viaRegions);

  const renderItem = (data: RenderItemParams) => <VIATreeItem {...data} />;

  return (
    <StyledAccordion defaultExpanded>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
        Regions
      </StyledAccordionSummary>

      <StyledAccordionDetails className={classes.root}>
        <AtlasTree tree={tree} renderItem={renderItem} />
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};

export default VIANavigator;
