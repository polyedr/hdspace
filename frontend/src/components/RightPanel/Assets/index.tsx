import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  StyledAccordion,
  StyledAccordionSummary,
} from '@Components/styledComponents';
import {
  loadAssetLists,
  loadAssets,
  setSelectedAssetListId,
} from '@Redux/project/actions';
import {
  selectAssetsLoader,
  selectCurrentProjectId,
} from '@Redux/project/selectors/base';
import { ALL_ASSETS_LIST_ID } from '@Constants/defaultParams';
import { selectSelectedAssetListId } from '@Redux/project/selectors/asset';
import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import AssetsGrid from './AssetsGrid';
import AssetLists from './AssetLists';

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

  progressWrapper: {
    width: '300px',
    height: '250px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const AssetsSection: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const projectId = useSelector(selectCurrentProjectId);
  const loadingAssets = useSelector(selectAssetsLoader);
  const selectedListId = useSelector(selectSelectedAssetListId);

  const handleListChange = useCallback(
    (listId) => {
      dispatch(setSelectedAssetListId(listId));
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch(loadAssetLists(String(projectId)));
  }, [dispatch, projectId]);

  useEffect(() => {
    dispatch(loadAssets(selectedListId || ALL_ASSETS_LIST_ID));
  }, [dispatch, selectedListId]);

  return (
    <div className={classes.root}>
      <StyledAccordion defaultExpanded square className={classes.accordion}>
        <StyledAccordionSummary expandIcon={<ExpandLessIcon />}>
          Project assets
        </StyledAccordionSummary>
        <AssetLists onListChange={handleListChange} />
        {!loadingAssets ? (
          <AssetsGrid />
        ) : (
          <div className={classes.progressWrapper}>
            <CircularProgress />
          </div>
        )}
      </StyledAccordion>
    </div>
  );
};

export default AssetsSection;
