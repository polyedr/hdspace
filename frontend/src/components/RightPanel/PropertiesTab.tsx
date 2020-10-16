import React from 'react';
import * as R from 'ramda';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ActiveElementBlock from '../../features/applyProperties/views/containers/Controls/ActiveElementBlock';
import { LIBRARY_ELEMENTS } from '../../domain/libraryElements/libraryElements';
import ControlSection from '../../features/applyProperties/views/components/ControlSection/ControlSection';
import RenameElement from '../../features/applyProperties/views/containers/Controls/RenameElement/RenameElement';
import ShareStyles from '../../features/applyProperties/views/containers/ShareStyles/ShareStyles';
import EditableStyles from '../../features/applyProperties/views/containers/EditableStyles/EditableStyles';
import { AVAILABLE_CONTROLS, Control, Entity } from '../../domain/core';
import Display from '../../features/applyProperties/views/containers/Controls/Display/Display';
import IndentsBlock from '../../features/applyProperties/views/containers/Controls/IndentsBlock';
import SizeBlock from '../../features/applyProperties/views/containers/Controls/SizeBlock/SizeBlock';
import TypographyBlock from '../../features/applyProperties/views/containers/Controls/TypographyBlock';
import BorderBlock from '../../features/applyProperties/views/containers/Controls/BorderBlock';
import BackgroundBlock from '../../features/applyProperties/views/containers/Controls/BackgroundBlock';
import ActionBlock from '../../features/applyProperties/views/containers/Controls/ActionBlock';
import MapProps from '../../features/applyProperties/views/containers/Controls/MapProps/MapProps';
import Placeholder from '../../features/applyProperties/views/containers/Controls/Placeholder/Placeholder';
import TextContent from '../../features/applyProperties/views/containers/Controls/TextContent/TextContent';
import Image from '../../features/applyProperties/views/containers/Controls/Image/Image';
import Screenshot from '../../features/applyProperties/views/containers/Controls/Screenshot/Screenshot';
import SmartContainer from '../../features/applyProperties/views/containers/Controls/SmartContainer/SmartContainer';
import Type from '../../features/applyProperties/views/containers/Controls/Type/Type';
import Value from '../../features/applyProperties/views/containers/Controls/Value/Value';
import Name from '../../features/applyProperties/views/containers/Controls/Name/Name';
import Ripple from '../../features/applyProperties/views/containers/Controls/Ripple/Ripple';
import SelectOptions from '../../features/applyProperties/views/containers/Controls/SelectOptions/SelectOptions';
import SelectValue from '../../features/applyProperties/views/containers/Controls/SelectValue/SelectValue';
import HeadingType from '../../features/applyProperties/views/containers/Controls/HeadingType/HeadingType';
import ListItems from '../../features/applyProperties/views/containers/Controls/ListItems/ListItems';
import Bullets from '../../features/applyProperties/views/containers/Controls/Bullets/Bullets';
import Ordered from '../../features/applyProperties/views/containers/Controls/Ordered/Ordered';
import LabelFor from '../../features/applyProperties/views/containers/Controls/LabelFor/LabelFor';
import DropdownItems from '../../features/applyProperties/views/containers/Controls/DropdownItems/DropdownItems';
import IsOpen from '../../features/applyProperties/views/containers/Controls/IsOpen/IsOpen';
import VideoSettings from '../../features/applyProperties/views/containers/Controls/VideoSettings/VideoSettings';
import FlexGrow from '../../features/applyProperties/views/containers/Controls/FlexGrow/FlexGrow';
import BackgroundPosition from '../../features/applyProperties/views/containers/Controls/BackgroundPosition/BackgroundPosition';
import BackgroundSize from '../../features/applyProperties/views/containers/Controls/BackgroundSize/BackgroundSize';
import { StateElement } from '../../redux/project/types';
import {
  createElements,
  setIsAddElementsModalOpened,
} from '../../redux/project/actions';
import Scrollbar from '../UI/Scrollbar';

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
  smartContainer: SmartContainer,
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

const useStyles = makeStyles({
  root: {
    height: '100%',
  },
});

type Props = {
  activeItem: StateElement;
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
  const classes = useStyles();
  const { type } = activeItem;

  return (
    <div className={classes.root}>
      <Scrollbar
        autoHeightMin="100%"
        style={{
          height: '100%',
        }}
      >
        <ActiveElementBlock
          activeItem={activeItem}
          libraryElements={LIBRARY_ELEMENTS}
          createElements={handleCreateElements}
          isAddElementsModalOpened={isAddElementsModalOpened}
          setIsAddElementsModalOpened={setIsAddElementsModalOpened}
        />
        {activeItem.type !== 'none' && (
          <div className="propsPanelBlock">
            <div className="propsPanelHeaderBlock">
              <p>Element properties</p>
            </div>

            {activeItem.type !== 'root' && (
              <div className="propsPanelContentBlock">
                <ControlSection title="Element's name">
                  <RenameElement />
                </ControlSection>
              </div>
            )}

            {activeItem.type !== 'root' && (
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

            {type &&
              R.toPairs(AVAILABLE_CONTROLS[type as Entity]).map(
                ([elementName, elementValue]) => {
                  return elementName === 'root' ? (
                    <div
                      className="propsPanelContentBlock"
                      key={`${elementName}-propsPanelContentBlock`}
                    >
                      {type &&
                        AVAILABLE_CONTROLS[type as Entity].root.map(
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
      </Scrollbar>
    </div>
  );
};

export default PropertiesTab;
