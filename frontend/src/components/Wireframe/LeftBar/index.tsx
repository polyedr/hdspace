import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import Screens from '@Components/LeftPanel/Screens';
import { Screen } from '@Src/types';
import { useWireframe } from '@Src/hooks/useWireframe';
import { setActiveScreen } from '@Redux/wireframe/wireframe';
import { selectCurrentWireframeScreen } from '@Redux/wireframe/selectors';
import { useUpdatedEffect } from '@Src/hooks';

const LeftSidebar = () => {
  const { moveToScreen } = useWireframe();

  const { projectId, screenId } = useParams<{
    projectId: string;
    screenId?: string;
  }>();
  const dispatch = useDispatch();

  const history = useHistory();
  const activeScreenId = useSelector(selectCurrentWireframeScreen);

  const handleSelected = (screen: Screen) => {
    moveToScreen(screen.id);
    dispatch(setActiveScreen(screen.id.toString()));
  };

  useUpdatedEffect(() => {
    history.push(`/wireframe/${projectId}/${activeScreenId}`);
  }, [activeScreenId]);

  useEffect(() => {
    if (screenId) {
      dispatch(setActiveScreen(screenId));
      setTimeout(() => moveToScreen(Number(screenId)), 200);
    }
  }, []);

  return (
    <Screens selected={Number(activeScreenId)} onSelected={handleSelected} />
  );
};

export default LeftSidebar;
