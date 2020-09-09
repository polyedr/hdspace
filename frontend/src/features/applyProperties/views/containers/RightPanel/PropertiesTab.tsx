import React from 'react';
import * as R from 'ramda';
import ActiveElementBlock from '../Controls/ActiveElementBlock';
import { LIBRARY_ELEMENTS } from '../../../../../domain/libraryElements/libraryElements';
import ControlSection from '../../components/ControlSection/ControlSection';
import RenameElement from '../Controls/RenameElement/RenameElement';
import ShareStyles from '../ShareStyles/ShareStyles';
import EditableStyles from '../EditableStyles/EditableStyles';
import {
  AVAILABLE_CONTROLS,
  Control,
  Entity,
} from '../../../../../domain/core';
import Display from '../Controls/Display/Display';
import IndentsBlock from '../Controls/IndentsBlock';
import SizeBlock from '../Controls/SizeBlock/SizeBlock';
import TypographyBlock from '../Controls/TypographyBlock';
import BorderBlock from '../Controls/BorderBlock';
import BackgroundBlock from '../Controls/BackgroundBlock';
import ActionBlock from '../Controls/ActionBlock';
import MapProps from '../Controls/MapProps/MapProps';
import Placeholder from '../Controls/Placeholder/Placeholder';
import TextContent from '../Controls/TextContent/TextContent';
import Image from '../Controls/Image/Image';
import Screenshot from '../Controls/Screenshot/Screenshot';
import Type from '../Controls/Type/Type';
import Value from '../Controls/Value/Value';
import Name from '../Controls/Name/Name';
import Ripple from '../Controls/Ripple/Ripple';
import SelectOptions from '../Controls/SelectOptions/SelectOptions';
import SelectValue from '../Controls/SelectValue/SelectValue';
import HeadingType from '../Controls/HeadingType/HeadingType';
import ListItems from '../Controls/ListItems/ListItems';
import Bullets from '../Controls/Bullets/Bullets';
import Ordered from '../Controls/Ordered/Ordered';
import LabelFor from '../Controls/LabelFor/LabelFor';
import DropdownItems from '../Controls/DropdownItems/DropdownItems';
import IsOpen from '../Controls/IsOpen/IsOpen';
import VideoSettings from '../Controls/VideoSettings/VideoSettings';
import FlexGrow from '../Controls/FlexGrow/FlexGrow';
import BackgroundPosition from '../Controls/BackgroundPosition/BackgroundPosition';
import BackgroundSize from '../Controls/BackgroundSize/BackgroundSize';
import { ActiveItem } from '../../../../../redux/project/types';
import {
  createElements,
  setIsAddElementsModalOpened,
} from '../../../../../redux/project/actions';

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
  screenshot: Screenshot,
  type: Type,
  value: Value,
  name: Name,
  showRipple: Ripple,
  selectOptions: SelectOptions,
  selectValue: SelectValue,
  headingType: HeadingType,
  listItems: ListItems,
  bullets: Bullets,
  isOrdered: Ordered,
  labelFor: LabelFor,
  dropdownItems: DropdownItems,
  isOpen: IsOpen,
  videoSettings: VideoSettings,
  flexGrow: FlexGrow,
  backgroundPosition: BackgroundPosition,
  backgroundSize: BackgroundSize,
};

type Props = {
  activeItem: ActiveItem;
  createElements: typeof createElements;
  setIsAddElementsModalOpened: typeof setIsAddElementsModalOpened;
  isAddElementsModalOpened: boolean;
};

const PropertiesTab: React.FC<Props> = ({
  setIsAddElementsModalOpened,
  isAddElementsModalOpened,
  createElements: handleCreateElements,
  activeItem,
}) => {
  const { itemType } = activeItem;

  return (
    <>
      <ActiveElementBlock
        activeItem={activeItem}
        libraryElements={LIBRARY_ELEMENTS}
        createElements={handleCreateElements}
        isAddElementsModalOpened={isAddElementsModalOpened}
        setIsAddElementsModalOpened={setIsAddElementsModalOpened}
      />
      {activeItem.itemType !== 'none' && (
        <div className="propsPanelBlock">
          <div className="propsPanelHeaderBlock">
            <p>Element properties</p>
          </div>

          {activeItem.itemType !== 'root' && (
            <div className="propsPanelContentBlock">
              <ControlSection title="Element's name">
                <RenameElement />
              </ControlSection>
            </div>
          )}

          {activeItem.itemType !== 'root' && (
            <>
              <div className="propsPanelContentBlock">
                <ShareStyles />
              </div>

              <div className="propsPanelContentBlock">
                <ControlSection title="Edit styles of">
                  <EditableStyles />
                </ControlSection>
              </div>
            </>
          )}

          {itemType &&
            R.toPairs(AVAILABLE_CONTROLS[itemType as Entity]).map(
              ([elementName, elementValue]) => {
                return elementName === 'root' ? (
                  <div
                    className="propsPanelContentBlock"
                    key={`${elementName}-propsPanelContentBlock`}
                  >
                    {itemType &&
                      AVAILABLE_CONTROLS[itemType as Entity].root.map(
                        (controlName) => {
                          const ControlComponent = CONTROLS[controlName];
                          return <ControlComponent key={controlName} />;
                        },
                      )}
                  </div>
                ) : (
                  <>
                    <div className="propsPanelHeaderBlock">
                      <p>{elementName}</p>
                    </div>

                    <div className="propsPanelContentBlock">
                      {elementValue.map((controlName) => {
                        const ControlComponent = CONTROLS[controlName];
                        return (
                          <ControlComponent
                            key={`${controlName}${elementName}`}
                            childName={elementName}
                          />
                        );
                      })}
                    </div>
                  </>
                );
              },
            )}
        </div>
      )}
    </>
  );
};

export default PropertiesTab;
