import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import * as R from 'ramda';

import { AppReduxState } from '$shared/types/app';
import { actionsCreators, selectors, T as ProjectT } from '$redux/project';
import { Scrollbar } from '$components/UI/Scrollbar/';
import { Spinner } from '$components/UI/Spinner/';

import { ActiveElementBlock } from '../Controls/ActiveElementBlock';
import { GroupElementsDirectionBlock } from '../Controls/GroupElementsDirectionBlock';
import { ActionBlock } from '../Controls/ActionBlock';
import { DifferentSettingsBlock } from '../Controls/DifferentSettingsBlock';
import { SizeBlock } from '../Controls/SizeBlock';
import { IndentsBlock } from '../Controls/IndentsBlock';
import { BackgroundBlock } from '../Controls/BackgroundBlock';
import { BorderBlock } from '../Controls/BorderBlock';
import { TypographyBlock } from '../Controls/TypographyBlock';
const styles = require('./PropertiesPanel.scss');

type OwnProps = {
  activeItem: ProjectT.ActiveItem;
  screen: ProjectT.IProjectScreen;
  onDelScenarioItem(): void;
};

type StateProps = {
  scenarios: ProjectT.IScenarios;
  libraryElements: ProjectT.ILibraryElements;
  currentScreen: ProjectT.IProjectScreen;
  isAddElementsModalOpened: boolean;
  loader: boolean;
};

const mapState = (state: AppReduxState): StateProps => ({
  scenarios: selectors.selectScenarios(state),
  libraryElements: selectors.selectLibraryElements(state),
  currentScreen: selectors.selectCurrentScreen(state),
  isAddElementsModalOpened: selectors.selectIsAddElementsModalOpened(state),
  loader: selectors.selectLoader(state),
});

const mapDispatch = {
  addElement: actionsCreators.addElement,
  addScenario: actionsCreators.addScenario,
  addContainer: actionsCreators.addContainer,
  setIsAddElementsModalOpened: actionsCreators.setIsAddElementsModalOpened,
};

const ENTITIES = [
  'container', 'button', 'textinput', 'hyperlink', 'ocrtext', 'image', 'select', 'map', 'calendar', 'clock',
] as const;
type Entity = typeof ENTITIES[number];
type Control = keyof typeof CONTROLS;

const CONTROLS = {
  direction: GroupElementsDirectionBlock,
  indents: IndentsBlock,
  size: SizeBlock,
  typography: TypographyBlock,
  border: BorderBlock,
  background: BackgroundBlock,
  action: ActionBlock,
  differentSettings: DifferentSettingsBlock,
};

const AVAILABLE_CONTROLS: Record<Entity, Control[]> = {
  container: ['direction', 'typography', 'border', 'background'],
  button: ['indents', 'size', 'typography', 'border', 'background', 'action', 'differentSettings'],
  textinput: ['indents', 'size', 'typography', 'border', 'background', 'differentSettings'],
  hyperlink: ['typography', 'border', 'background', 'action'],
  ocrtext: ['indents', 'size', 'typography', 'border', 'background', 'differentSettings'],
  image: ['indents', 'size', 'border', 'background'],
  select: ['indents', 'size', 'typography', 'border', 'background'],
  map: ['indents', 'size', 'typography', 'border', 'background', 'differentSettings'],
  calendar: ['indents', 'size', 'typography', 'border', 'background'],
  clock: ['indents', 'size', 'typography', 'border', 'background'],
};

export type PropertiesPanelProps = StateProps & typeof mapDispatch & OwnProps;

const SCROLLBAR_STYLES = {
  height: '100%',
};

const Component: React.FC<PropertiesPanelProps> = ({
  activeItem,
  screen,
  onDelScenarioItem,
  loader,

  scenarios,
  libraryElements,

  addScenario,
  addContainer,
  isAddElementsModalOpened,
  setIsAddElementsModalOpened,
}) => {
  const activeItemID = activeItem.itemType === 'root' ? 'root' : activeItem.itemId;
  const currentItemType = activeItem.itemType === 'root' ? 'container' : R.prop(activeItemID, screen.listSortable)?.type;
  const disablePanel = !screen;

  return (
    <div className={classNames(styles.editorRightPanel)}>
      <Scrollbar
        style={SCROLLBAR_STYLES}
        maxHeight="100%"
      >
        <ActiveElementBlock
          activeItem={activeItem}
          disablePanel={disablePanel}
          onDelScenarioItem={onDelScenarioItem}
          scenarios={scenarios}
          libraryElements={libraryElements}
          addScenario={addScenario}
          addContainer={addContainer}
          isAddElementsModalOpened={isAddElementsModalOpened}
          setIsAddElementsModalOpened={setIsAddElementsModalOpened}
        />
        {activeItem.itemType !== 'none' && (
          <div className="propsPanelBlock">
            <div className="propsPanelHeaderBlock">
              <p>Properties</p>
            </div>
            <div className="propsPanelContentBlock">
              {currentItemType && AVAILABLE_CONTROLS[currentItemType as Entity].map(controlName => {
                const Component = CONTROLS[controlName];
                return <Component key={controlName}/>
              })}
            </div>
          </div>
        )}
      </Scrollbar>
      <Spinner active={loader} />
    </div>
  );
};

export const PropertiesPanel = connect(mapState, mapDispatch)(Component);
