import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
// import ElementsBlock from '@Components/RightPanel/ElementsTab/ElementsBlock';
import { LIBRARY_ELEMENTS } from '@Domain/libraryElements/libraryElements';
import { createElementsHierarchy } from '@Utils/elementsHierarchy';
import Scrollbar from '@Components/UI/Scrollbar';
import { selectVIAModeEnabled } from '@Redux/project/selectors/via';
import FrameworkSection from '@/components/RightPanel/FrameworkSection';
import { setActiveElement } from '@Redux/project/actions';
import { Screen } from '@Src/types';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import Navigator from './Navigator';
import Screens from './Screens';
import {
  ElementsIcon,
  ScreensIcon,
  StylesIcon,
  LibraryIcon,
  LayersIcon,
} from './icons';
import LibraryMenu from './LibraryMenu';
import Styles from './Styles';
import VIANavigator from './VIANavigator';
import { ElementsMenu } from './ElementsMenu';

const { elements, templates, library } =
  createElementsHierarchy(LIBRARY_ELEMENTS);

// function RenderElementGrid({ elements }: { elements: object }) {
//   return (
//     <>
//       {Object.entries(elements).map(([key, value]) => (
//         <ElementsBlock key={key} title={key} elements={value} expandable />
//       ))}
//     </>
//   );
// }

function Layers() {
  const viaMode = useSelector(selectVIAModeEnabled);
  return viaMode ? <VIANavigator /> : <Navigator />;
}

const EditorScreens = () => {
  const currentScreenId = useSelector(selectCurrentScreenId);
  const currentProjectId = useSelector(selectCurrentProjectId);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleClick = (screen: Screen) => {
    dispatch(setActiveElement(screen.element));
    history.push(`/project/${currentProjectId}/${screen.id}`);
  };

  return <Screens selected={currentScreenId} onSelected={handleClick} />;
};

export const mainMenu = [
  {
    id: 'screens',
    label: 'Screens',
    icon: ScreensIcon,
    component: EditorScreens,
  },
  {
    id: 'layers-tab',
    label: 'Layers',
    icon: LayersIcon,
    component: Layers,
  },
  {
    id: 'elements-tab',
    label: 'Elements',
    icon: ElementsIcon,
    component: () => (
      // <Scrollbar>
      //   <RenderElementGrid elements={elements} />
      // </Scrollbar>
      <ElementsMenu elements={elements} />
    ),
  },
  {
    id: 'styles',
    label: 'Styles',
    icon: StylesIcon,
    component: () => (
      <Scrollbar>
        <FrameworkSection />
        <Styles />
      </Scrollbar>
    ),
  },
  {
    id: 'libraries',
    label: 'Library',
    icon: LibraryIcon,
    component: () => <LibraryMenu library={library} templates={templates} />,
  },
];
