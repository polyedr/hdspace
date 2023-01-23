import { selectVIARegionsAsArray } from '@Redux/project/selectors/via';
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AtlasTree, {
  RenderItemParams,
  TreeData,
  TreeDestinationPosition,
  TreeSourcePosition,
} from '@atlaskit/tree';
import { MenuItem } from '@material-ui/core';
import { NNModelName, VIARegion } from '@Src/types';
import { makeStyles } from '@material-ui/core/styles';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
  StyledTextField,
} from '@Components/styledComponents';
import { NN_MODEL_LIST } from '@Constants/frameworks/index';
import { updateVIARegionLayer, setActiveNNModel } from '@Redux/project/actions';
import { selectActiveNNModel } from '@Redux/project/selectors/element';
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
  selectWrapper: {
    padding: '0 1em',
  },
});

const VIANavigator: FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const viaRegions = useSelector(selectVIARegionsAsArray);
  const activeNNModel = useSelector(selectActiveNNModel);
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
    <>
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
      <StyledAccordion defaultExpanded>
        <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
          Model
        </StyledAccordionSummary>
        <div className={classes.selectWrapper}>
          <StyledTextField
            fullWidth
            margin="dense"
            label="Model"
            select
            value={activeNNModel}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              dispatch(setActiveNNModel(e.target.value as NNModelName));
            }}
          >
            {NN_MODEL_LIST.map((model) => (
              <MenuItem key={model.name} value={model.name}>
                {model.label}
              </MenuItem>
            ))}
          </StyledTextField>
        </div>
      </StyledAccordion>
    </>
  );
};

export default VIANavigator;
