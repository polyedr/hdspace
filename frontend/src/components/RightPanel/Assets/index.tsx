import React, { useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  StyledAccordion,
  StyledAccordionSummary,
} from '@Components/styledComponents';
import makeStyles from '@material-ui/core/styles/makeStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { loadAssetLists, loadAssets } from '@Redux/project/actions';
import { selectAssetsLoader } from '@Redux/project/selectors/base';
import { DEFAULT_ASSETS_LIST_ID } from '@Constants/defaultParams';
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
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const loadingAssets = useSelector(selectAssetsLoader);

  const handleListChange = useCallback(
    (listId) => {
      setSelectedListId(listId);
    },
    [setSelectedListId],
  );

  useEffect(() => {
    dispatch(loadAssetLists());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      loadAssets(
        selectedListId === DEFAULT_ASSETS_LIST_ID ? null : selectedListId,
      ),
    );
  }, [dispatch, selectedListId]);

  return (
    <div className={classes.root}>
      <StyledAccordion defaultExpanded square className={classes.accordion}>
        <StyledAccordionSummary>Project assets</StyledAccordionSummary>
        <AssetLists onListChange={handleListChange} />
        {!loadingAssets ? (
          <AssetsGrid selectedAssetListId={selectedListId} />
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
