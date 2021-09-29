import { selectVIARegionsAsArray } from '@Redux/project/selectors/via';
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AtlasTree, {
  RenderItemParams,
  TreeData,
  TreeDestinationPosition,
  TreeSourcePosition,
} from '@atlaskit/tree';
import { VIARegion } from '@Src/types';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
} from '@Components/styledComponents';
import { updateVIARegionLayer } from '@Redux/project/actions';
import { sortByLayer } from '@Utils/viaHelpers';
import VIATreeItem from './VIATreeItem';

const convertVIAToTree = (viaRegions: VIARegion[]): TreeData => ({
  rootId: 'via-tree-root',
  items: {
    'via-tree-root': {
      id: 'via-tree-root',
      children: viaRegions
        .sort(sortByLayer)
        .map((region) => region.id)
        .reverse(),
      isExpanded: true,
      data: {
        id: 'via-tree-root',
      },
      hasChildren: true,
    },
    ...Object.fromEntries(
      viaRegions.map((region) => [
        region.id,
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

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItem: 'stretch',
  },
});

const VIANavigator: FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const viaRegions = useSelector(selectVIARegionsAsArray);

  const tree = convertVIAToTree(viaRegions);

  const dragEnd = (
    source: TreeSourcePosition,
    destination?: TreeDestinationPosition,
  ) => {
    if (!destination) return;
    const targetId = tree.items[source.parentId].children[source.index];

    dispatch(
      updateVIARegionLayer(
        targetId as string,
        Object.keys(tree.items).length - 2 - (destination.index || 0), // -2 because tree.items has one additional item 'root' for technical purposes only
      ),
    );
  };

  const renderItem = (data: RenderItemParams) => <VIATreeItem {...data} />;

  return (
    <StyledAccordion defaultExpanded>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
        Regions
      </StyledAccordionSummary>

      <StyledAccordionDetails className={classes.root}>
        <AtlasTree
          tree={tree}
          renderItem={renderItem}
          isDragEnabled
          onDragEnd={dragEnd}
        />
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};

export default VIANavigator;
