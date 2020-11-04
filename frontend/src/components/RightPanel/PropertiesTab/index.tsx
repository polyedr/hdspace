import React from 'react';
import { useSelector } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import RenameElement from './Controls/RenameElement/RenameElement';
import ShareStyles from './helperComponents/ShareStyles/ShareStyles';
import { AVAILABLE_CONTROLS, Control, Entity } from '../../../domain/core';
import Display from './Controls/Display/Display';
import IndentsBlock from './Controls/IndentsBlock';
import SizeBlock from './Controls/SizeBlock/SizeBlock';
import TypographyBlock from './Controls/TypographyBlock';
import BorderBlock from './Controls/BorderBlock';
import BackgroundBlock from './Controls/BackgroundBlock';
import ActionBlock from './Controls/ActionBlock';
import MapProps from './Controls/MapProps/MapProps';
import Placeholder from './Controls/Placeholder/Placeholder';
import TextContent from './Controls/TextContent/TextContent';
import Image from './Controls/Image/Image';
import Type from './Controls/Type/Type';
import Value from './Controls/Value/Value';
import Name from './Controls/Name/Name';
import Ripple from './Controls/Ripple/Ripple';
import SelectOptions from './Controls/SelectOptions/SelectOptions';
import SelectValue from './Controls/SelectValue/SelectValue';
import HeadingType from './Controls/HeadingType/HeadingType';
import ListItems from './Controls/ListItems/ListItems';
import Bullets from './Controls/Bullets';
import Ordered from './Controls/Ordered/Ordered';
import LabelFor from './Controls/LabelFor/LabelFor';
import DropdownItems from './Controls/DropdownItems/DropdownItems';
import IsOpen from './Controls/IsOpen/IsOpen';
import VideoSettings from './Controls/VideoSettings/VideoSettings';
import FlexGrow from './Controls/FlexGrow';
import BackgroundSize from './Controls/BackgroundSize';
import Scrollbar from '../../UI/Scrollbar';
import {
  selectActiveElement,
  selectFreeCanvasMode,
} from '../../../redux/project/selectors';
import withSmartContainer from './Controls/SmartContainer/withSmartContainer';
import { NNBlockType } from '../../../constants/defaultParams';
import ControlSection from './helperComponents/ControlSection';

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
  smartHeader: withSmartContainer(NNBlockType.HEADER),
  smartFooter: withSmartContainer(NNBlockType.FOOTER),
  smartForm: withSmartContainer(NNBlockType.FORM),
  smartWebpage: withSmartContainer(NNBlockType.WEBPAGE),
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
  const isFreeCanvasMode = useSelector(selectFreeCanvasMode);

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
            {AVAILABLE_CONTROLS[type as Entity].map((controlName) => {
              if (isFreeCanvasMode && controlName === 'size') {
                return null;
              }
              const Control = CONTROLS[controlName];

              return (
                <ControlSection key={controlName} title={controlName}>
                  <Control />
                </ControlSection>
              );
            })}

            {type !== 'root' && (
              <>
                <ControlSection title="Share styles">
                  <ShareStyles />
                </ControlSection>

                <ControlSection title="Element name">
                  <RenameElement />
                </ControlSection>
              </>
            )}
          </>
        )}
      </Scrollbar>
    </div>
  );
};

export default PropertiesTab;
