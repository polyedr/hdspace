import React from 'react';
import { useSelector } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ControlSection from '../../features/applyProperties/views/components/ControlSection/ControlSection';
import RenameElement from '../../features/applyProperties/views/containers/Controls/RenameElement/RenameElement';
import ShareStyles from '../../features/applyProperties/views/containers/ShareStyles/ShareStyles';
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
import BackgroundSize from '../../features/applyProperties/views/containers/Controls/BackgroundSize/BackgroundSize';
import Scrollbar from '../UI/Scrollbar';
import { selectActiveElement } from '../../redux/project/selectors';

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
  backgroundSize: BackgroundSize,
};

const useStyles = makeStyles({
  propertiesTab: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
});

const PropertiesTab: React.FC = () => {
  const classes = useStyles();
  const activeElement = useSelector(selectActiveElement);

  const { type } = activeElement;

  return (
    <div className={classes.propertiesTab}>
      <Scrollbar
        autoHeightMin="100%"
        style={{
          height: '100%',
        }}
      >
        {type !== 'none' && (
          <>
            {type !== 'root' && (
              <>
                <ControlSection title="Element name">
                  <RenameElement />
                </ControlSection>

                <ControlSection title="Share styles">
                  <ShareStyles />
                </ControlSection>
              </>
            )}

            {type &&
              AVAILABLE_CONTROLS[type as Entity].map((controlName) => {
                const Control = CONTROLS[controlName];

                return (
                  <ControlSection key={controlName} title={controlName}>
                    <Control />
                  </ControlSection>
                );
              })}
          </>
        )}
      </Scrollbar>
    </div>
  );
};

export default PropertiesTab;
