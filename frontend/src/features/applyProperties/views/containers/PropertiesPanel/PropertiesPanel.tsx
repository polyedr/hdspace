import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import * as R from 'ramda';

import { AppReduxState } from '$shared/types/app';
import { actionsCreators, selectors, T as ProjectT } from '$redux/project';
import { Scrollbar } from '$components/UI/Scrollbar/';
import { Spinner } from '$components/UI/Spinner/';
import { AVAILABLE_CONTROLS, Control, Entity } from '$domain/core';
import { LIBRARY_ELEMENTS, LibraryElements } from '$domain/libraryElements';

import { ActiveElementBlock } from '../Controls/ActiveElementBlock';
import { ActionBlock } from '../Controls/ActionBlock';
import { MapProps } from '../Controls/MapProps/MapProps';
import { SizeBlock } from '../Controls/SizeBlock/SizeBlock';
import { IndentsBlock } from '../Controls/IndentsBlock';
import { BackgroundBlock } from '../Controls/BackgroundBlock';
import { BorderBlock } from '../Controls/BorderBlock';
import { TypographyBlock } from '../Controls/TypographyBlock';
import { Placeholder } from '../Controls/Placeholder/Placeholder';
import { TextContent } from '../Controls/TextContent/TextContent';
import { Display } from '../Controls/Display/Display';
import { Image } from '../Controls/Image/Image';
import { Value } from '../Controls/Value/Value';
import { Name } from '../Controls/Name/Name';
import { Ripple } from '../Controls/Ripple/Ripple';
import { Type } from '../Controls/Type/Type';
import { SelectOptions } from '../Controls/SelectOptions/SelectOptions';
import { SelectValue } from '../Controls/SelectValue/SelectValue';
const styles = require('./PropertiesPanel.scss');

type StateProps = {
  scenarios: ProjectT.IScenarios;
  activeItem: ProjectT.ActiveItem;
  screen: ProjectT.IProjectScreen;
  isAddElementsModalOpened: boolean;
  loader: boolean;
};

const mapState = (state: AppReduxState): StateProps => ({
  activeItem: selectors.selectActiveItem(state),
  scenarios: selectors.selectScenarios(state),
  screen: selectors.selectCurrentScreen(state),
  isAddElementsModalOpened: selectors.selectIsAddElementsModalOpened(state),
  loader: selectors.selectLoader(state),
});

const mapDispatch = {
  addElement: actionsCreators.addElement,
  addElementsIntoContainer: actionsCreators.addElementsIntoContainer,
  wrapIntoContainer: actionsCreators.wrapIntoContainer,
  setIsAddElementsModalOpened: actionsCreators.setIsAddElementsModalOpened,
  deleteActiveItem: actionsCreators.deleteActiveItem,
};

const CONTROLS: Record<Control, React.ComponentType<any>> = {
  display: Display,
  indents: IndentsBlock,
  size: SizeBlock,
  typography: TypographyBlock,
  border: BorderBlock,
  background: BackgroundBlock,
  action: ActionBlock,
  mapProps: MapProps,
  placeholder: Placeholder,
  textContent: TextContent,
  image: Image,
  type: Type,
  value: Value,
  name: Name,
  showRipple: Ripple,
  selectOptions: SelectOptions,
  selectValue: SelectValue,
};

export type PropertiesPanelProps = StateProps & typeof mapDispatch;

const SCROLLBAR_STYLES = {
  height: '100%',
};

const Component: React.FC<PropertiesPanelProps> = ({
  activeItem,
  screen,
  deleteActiveItem,
  loader,
  scenarios,
  addElementsIntoContainer,
  wrapIntoContainer,
  isAddElementsModalOpened,
  setIsAddElementsModalOpened,
}) => {
  const activeItemID = activeItem.itemType === 'root' ? 'root' : activeItem.itemId;
  const currentItemType = activeItem.itemType === 'root' ? 'root' : R.prop(activeItemID, screen.listSortable)?.type;
  const disablePanel = !screen;

  return (
    <div className={classNames(styles.editorRightPanel)}>
      <Scrollbar
        style={SCROLLBAR_STYLES}
        autoHeightMin="100%"
      >
        <ActiveElementBlock
          activeItem={activeItem}
          disablePanel={disablePanel}
          onDelScenarioItem={deleteActiveItem}
          scenarios={scenarios}
          libraryElements={LIBRARY_ELEMENTS}
          addElementsIntoContainer={addElementsIntoContainer}
          onWrapIntoContainer={wrapIntoContainer}
          isAddElementsModalOpened={isAddElementsModalOpened}
          setIsAddElementsModalOpened={setIsAddElementsModalOpened}
        />
        {activeItem.itemType !== 'none' && (
          <div className="propsPanelBlock">
            <div className="propsPanelHeaderBlock">
              <p>Element properties</p>
            </div>
            {currentItemType && R.toPairs(AVAILABLE_CONTROLS[currentItemType as Entity]).map(([elementName, elementValue]) => {
                return elementName === 'root' ? (
                  <div className="propsPanelContentBlock">
                    {currentItemType && AVAILABLE_CONTROLS[currentItemType as Entity]['root'].map(controlName => {
                      const Component = CONTROLS[controlName];
                      return <Component key={controlName} />
                    })}
                  </div>
                ) : (
                  <>
                    <div className="propsPanelHeaderBlock">
                      <p>{elementName}</p>
                    </div>
                    <div className="propsPanelContentBlock">{
                      elementValue.map(controlName => {
                        const Component = CONTROLS[controlName];
                        return <Component key={`${controlName}${elementName}`} childName={elementName} />
                      })
                    }</div>
                  </>
                )
            })}
          </div>
        )}
      </Scrollbar>
      <Spinner active={loader} />
    </div>
  );
};

export const PropertiesPanel = connect(mapState, mapDispatch)(Component);
