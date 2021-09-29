/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import { selectVIAModeEnabled } from '@Redux/project/selectors/via';
import { selectScreenByIdWrapper } from '@Redux/project/selectors/screen';
import VIA from '@Components/Editor/VIA';
import VIARightPanel from '@Components/Editor/VIA/VIARightPanel';
import {
  activateScreen,
  clearEditableScreen,
  setEditableScreen,
} from '@Redux/project/actions';
import ELEMENT_IDS from '@Constants/elementIds';
import Tour, { ReactourStep } from 'reactour';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import { selectUserGuideActive } from '@Redux/user/selectors';
import {
  setUserGuideActive,
  setUserExperience,
  changeProfileData,
} from '@Redux/user/actions';
import { Experience } from '@Src/types/types';
import { DOMHandler } from '@Components/Editor/Workspace/DOMHandler';
import Workspace from '../components/Editor/Workspace/Workspace';
import RightPanel from '../components/RightPanel';

const tourSteps: ReactourStep[] = [
  {
    selector: `#${ELEMENT_IDS.screenList}`,
    content: 'Here you can see the list of all the project screens.',
  },
  {
    selector: `#${ELEMENT_IDS.rightPanel}`,
    content: 'Create element using buttons on this panel.',
  },
  {
    selector: `#${ELEMENT_IDS.textBlock}`,
    content: "Please click the 'TextBlock.'",
  },
  {
    selector: `#${ELEMENT_IDS.canvas}`,
    content:
      "There are all the elements you added. Please click the 'TextBlock' you just added.",
  },
  {
    selector: `#${ELEMENT_IDS.canvas}`,
    content:
      'If you click element, you can see icons to duplicate or delete the element. Please try duplicate or delete by clicking icon buttons.',
  },
  {
    selector: `#${ELEMENT_IDS.textBlock}`,
    content: "Let's add new 'TextBlock' again by clicking 'TextBlock.",
  },
  {
    selector: `#${ELEMENT_IDS.canvas}`,
    content: "Please click the 'TextBlock' you just added.",
  },
  {
    selector: `#${ELEMENT_IDS.rightPanel}`,
    content: 'You can change properties of element you added on this panel.',
  },
  {
    selector: `#${ELEMENT_IDS.richTextEditor}`,
    content: "Please change 'This is text block' as 'hyperlink'.",
  },
  {
    selector: `#${ELEMENT_IDS.link}`,
    content: "Select the 'Make Link' to make hyperlink.",
  },
  {
    selector: `#${ELEMENT_IDS.itemUrl}`,
    content: 'You can input link to make hyperlink.',
  },
  {
    selector: `#${ELEMENT_IDS.navigator}`,
    content:
      'There all the elements of the current screen are displayed and you manage the element as well here.',
  },
  {
    selector: `#${ELEMENT_IDS.navigator}`,
    content: "Please click the mouse right button on the 'TextBlock'.",
  },
  {
    selector: `#${ELEMENT_IDS.navigator}`,
    content: "Click 'Copy",
  },
  {
    selector: `#${ELEMENT_IDS.navigator}`,
    content:
      "Click the mouse right button on the 'root' and click 'Paste'. You can paste element to container like 'root'.",
  },
  {
    selector: `#${ELEMENT_IDS.layoutSelector}`,
    content: 'Try different layouts using this selector.',
  },
  {
    selector: `#${ELEMENT_IDS.masterScreenListItem}`,
    content: 'Here you can enable the master screen of the current project.',
  },
  {
    selector: ``,
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

type Props = {
  screenId: number;
};

const Screen: React.FC<Props> = ({ screenId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const screen = useSelector(selectScreenByIdWrapper(screenId));
  const currentProjectId = useSelector(selectCurrentProjectId);
  const viaModeEnabled = useSelector(selectVIAModeEnabled);

  useEffect(() => {
    if (screen) {
      DOMHandler.INSTANCE.removeEmptyEntries();
      dispatch(activateScreen(screen.id));
    } else {
      history.push(`/project/${currentProjectId}`);
    }
  }, [history, dispatch, screen, currentProjectId]);

  useEffect(() => {
    dispatch(setEditableScreen(screen.id));
    return () => {
      dispatch(clearEditableScreen(screen));
    };
  }, [dispatch, screen.id]);

  const userGuideActive = useSelector(selectUserGuideActive);
  const { shape } = useTheme();

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
        <DndProvider backend={HTML5Backend}>
          <Workspace />

          <RightPanel />
        </DndProvider>
      )}
    </div>
  );
};

export default Screen;
