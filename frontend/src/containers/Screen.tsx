/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Tour, { ReactourStep } from 'reactour';
import { useTheme, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';
import {
  selectAssetsListsLoader,
  selectCurrentProjectId,
} from '@Redux/project/selectors/base';
import { selectVIAModeEnabled } from '@Redux/project/selectors/via';
import { selectScreenByIdWrapper } from '@Redux/project/selectors/screen';
import VIA from '@Components/Editor/VIA';
import VIARightPanel from '@Components/Editor/VIA/VIARightPanel';
import { activateScreen, loadAssetLists } from '@Redux/project/actions';
import ELEMENT_IDS from '@Constants/elementIds';
import { selectUserGuideActive } from '@Redux/user/selectors';
import {
  setUserGuideActive,
  setUserExperience,
  changeProfileData,
} from '@Redux/user/actions';
import { Experience } from '@Src/types';
import { DOMHandler } from '@Components/Editor/Workspace/DOMHandler';
import { selectAllAssetLists } from '@Redux/project/selectors/asset';
import Workspace from '@Components/Editor/Workspace/Workspace';
import RightPanel from '@Components/RightPanel';

const tourSteps: ReactourStep[] = [
  {
    selector: `#${ELEMENT_IDS.screenList}`,
    content: 'Here you can see the list of all the project screens.',
  },
  {
    selector: `#${ELEMENT_IDS.rightPanel}`,
    content: 'Create elements using buttons on this panel.',
  },
  {
    selector: `#${ELEMENT_IDS.textBlock}`,
    content: "Please click the 'TextBlock'.",
  },
  {
    selector: `#${ELEMENT_IDS.canvas}`,
    content:
      "There are all the elements you added. Please click the 'TextBlock' you just added.",
  },
  {
    selector: `#${ELEMENT_IDS.canvas}`,
    content:
      'If you click the element, you can see icons to duplicate or delete the element. Please try to duplicate or delete by clicking the icon buttons.',
  },
  {
    selector: `#${ELEMENT_IDS.textBlock}`,
    content: "Let's add a new 'TextBlock' again by clicking 'TextBlock.",
  },
  {
    selector: `#${ELEMENT_IDS.canvas}`,
    content: "Please click the 'TextBlock' you just added.",
  },
  {
    selector: `#${ELEMENT_IDS.rightPanel}`,
    content:
      'In this panel, you can change the properties of elements you added.',
  },
  {
    selector: `#${ELEMENT_IDS.richTextEditor}`,
    content: "Please change 'This is a text block' as 'hyperlink'.",
  },
  {
    selector: `#${ELEMENT_IDS.link}`,
    content: "Select the 'Make Link' to make a hyperlink.",
  },
  {
    selector: `#${ELEMENT_IDS.itemUrl}`,
    content: 'You can input a link to make a hyperlink.',
  },
  {
    selector: `#${ELEMENT_IDS.navigator}`,
    content:
      'All the elements of the current screen are displayed and you can manage the element as well here.',
  },
  {
    selector: `#${ELEMENT_IDS.navigator}`,
    content: "Please click the mouse right button on the 'TextBlock'.",
  },
  {
    selector: `#${ELEMENT_IDS.navigator}`,
    content: "Click 'Copy'",
  },
  {
    selector: `#${ELEMENT_IDS.navigator}`,
    content:
      "Click the mouse right button on the 'root' and click 'Paste'. You can paste elements into containers like 'root'.",
  },
  {
    selector: `#${ELEMENT_IDS.layoutSelector}`,
    content: 'Please try different layouts using this selector.',
  },
  {
    selector: `#${ELEMENT_IDS.masterScreenListItem}`,
    content: 'Here you can enable the master screen of the current project.',
  },
  {
    selector: '',
    content: 'Congratulation. Well done. Thanks for following me.',
  },
];

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

  const userGuideActive = useSelector(selectUserGuideActive);
  const { shape } = useTheme<Theme>();

  return (
    <div className={classes.screen}>
      <Tour
        isOpen={userGuideActive}
        steps={tourSteps}
        onRequestClose={() => {
          dispatch(
            changeProfileData({
              experienced: Experience.EXPERIENCED,
            }),
          );
          dispatch(setUserExperience(Experience.EXPERIENCED));
          dispatch(setUserGuideActive(false));
        }}
        closeWithMask={false}
        rounded={shape.borderRadius}
        maskSpace={0}
        scrollDuration={200}
        disableFocusLock
      />
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
