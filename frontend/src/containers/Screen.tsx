/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from '@/compat/router';
import { makeStyles } from '@mui/styles';
import {
  selectAssetsListsLoader,
  selectCurrentProjectId,
} from '@Redux/project/selectors/base';
import { selectVIAModeEnabled } from '@Redux/project/selectors/via';
import { selectScreenByIdWrapper } from '@Redux/project/selectors/screen';
import VIA from '@Components/Editor/VIA';
import VIARightPanel from '@Components/Editor/VIA/VIARightPanel';
import { activateScreen, loadAssetLists } from '@Redux/project/actions';
import { DOMHandler } from '@Components/Editor/Workspace/DOMHandler';
import { selectAllAssetLists } from '@Redux/project/selectors/asset';
import Workspace from '@Components/Editor/Workspace/Workspace';
import RightPanel from '@Components/RightPanel';

const useStyles = makeStyles({
  screen: {
    display: 'flex',
    minHeight: '100%',
    height: 1, // allows children use height in %
    flex: 1,
    overflow: 'auto',
  },
});

interface Props {
  screenId: number;
}

const Screen: React.FC<Props> = ({ screenId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const screen = useSelector(selectScreenByIdWrapper(screenId));
  const currentProjectId = useSelector(selectCurrentProjectId);
  const viaModeEnabled = useSelector(selectVIAModeEnabled);

  const assetLists = useSelector(selectAllAssetLists);
  const assetListsLoading = useSelector(selectAssetsListsLoader);

  useEffect(() => {
    if (screen) {
      DOMHandler.INSTANCE.removeEmptyEntries();
      dispatch(activateScreen(screen.id));
    } else {
      history.push(`/project/${currentProjectId}`);
    }
  }, [history, dispatch, screen, currentProjectId]);

  useEffect(() => {
    if (!assetLists && !assetListsLoading) {
      dispatch(loadAssetLists(String(currentProjectId)));
    }
  }, [assetLists, dispatch, currentProjectId, assetListsLoading]);

  return (
    <div className={classes.screen}>
      {viaModeEnabled ? (
        <>
          <VIA />
          <VIARightPanel />
        </>
      ) : (
        <>
          <Workspace />
          <RightPanel />
        </>
      )}
    </div>
  );
};

export default Screen;
