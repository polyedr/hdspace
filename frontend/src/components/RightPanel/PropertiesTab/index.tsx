import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  selectActiveElement,
  selectCurrentEditableStyles,
} from '@Redux/project/selectors/element';
import { selectFreeCanvasMode } from '@Redux/project/selectors/base';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import RenameElement from './Controls/RenameElement/RenameElement';
import ShareStyles from './helperComponents/ShareStyles/ShareStyles';
import { AVAILABLE_CONTROLS } from '../../../domain/core';
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
import SelectOptions from './Controls/SelectOptions';
import SelectValue from './Controls/SelectValue/SelectValue';
import HeadingType from './Controls/HeadingType/HeadingType';
import ListItems from './Controls/ListItems';
import Bullets from './Controls/Bullets';
import Ordered from './Controls/Ordered/Ordered';
import LabelFor from './Controls/LabelFor/LabelFor';
import DropdownItems from './Controls/DropdownItems';
import IsOpen from './Controls/IsOpen/IsOpen';
import VideoSettings from './Controls/VideoSettings/VideoSettings';
import FlexGrow from './Controls/FlexGrow';
import BackgroundSize from './Controls/BackgroundSize';
import Scrollbar from '../../UI/Scrollbar';
import withSmartContainer from './Controls/SmartContainer/withSmartContainer';
import ControlSection from './helperComponents/ControlSection';
import ColumnsControls from './Controls/Columns';
import StylesOn from './Controls/StylesOn/StylesOn';
import { Control, Entity, NNBlockType } from '../../../types';

type ControlInfo = {
  Control: React.ComponentType<any>;
  styles?: Array<keyof React.CSSProperties>;
};

const CONTROLS: Record<Control, ControlInfo> = {
  display: {
    Control: Display,
    styles: ['display', 'justifyContent', 'alignItems'],
  },
  indents: {
    Control: IndentsBlock,
    styles: [
      'marginTop',
      'marginBottom',
      'marginLeft',
      'marginRight',
      'paddingTop',
      'paddingBottom',
      'paddingLeft',
      'paddingRight',
    ],
  },
  size: { Control: SizeBlock, styles: ['width', 'height'] },
  typography: {
    Control: TypographyBlock,
    styles: [
      'fontFamily',
      'fontSize',
      'fontWeight',
      'fontStyle',
      'textAlign',
      'color',
    ],
  },
  border: {
    Control: BorderBlock,
    styles: ['borderColor', 'borderWidth', 'borderRadius'],
  },
  background: { Control: BackgroundBlock, styles: ['backgroundColor'] },
  action: { Control: ActionBlock },
  mapProps: { Control: MapProps },
  placeholder: { Control: Placeholder },
  textContent: { Control: TextContent, styles: [] },
  image: { Control: Image, styles: [] },
  smartHeader: { Control: withSmartContainer(NNBlockType.HEADER) },
  smartFooter: { Control: withSmartContainer(NNBlockType.FOOTER) },
  smartForm: { Control: withSmartContainer(NNBlockType.FORM) },
  smartWebpage: { Control: withSmartContainer(NNBlockType.WEBPAGE) },
  stylesOn: { Control: StylesOn },
  type: { Control: Type },
  value: { Control: Value },
  name: { Control: Name },
  showRipple: { Control: Ripple },
  selectOptions: { Control: SelectOptions },
  selectValue: { Control: SelectValue },
  headingType: { Control: HeadingType },
  listItems: { Control: ListItems },
  bullets: { Control: Bullets, styles: ['listStyleType'] },
  isOrdered: { Control: Ordered },
  labelFor: { Control: LabelFor },
  dropdownItems: { Control: DropdownItems },
  isOpen: { Control: IsOpen },
  videoSettings: { Control: VideoSettings },
  flexGrow: { Control: FlexGrow, styles: ['flexGrow'] },
  backgroundSize: { Control: BackgroundSize, styles: ['backgroundSize'] },
  columns: {
    Control: ColumnsControls,
    styles: [
      'columnCount',
      'columnGap',
      'columnFill',
      'columnWidth',
      'columnRuleStyle',
      'columnRuleWidth',
      'columnRuleColor',
    ],
  },
};

const useStyles = makeStyles({
  propertiesTab: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
});

const PropertiesTab: React.FC = () => {
  const classes = useStyles();
  const activeElement = useSelector(selectActiveElement);
  const isFreeCanvasMode = useSelector(selectFreeCanvasMode);
  const isPrototypeMode = useSelector(selectIsPrototypeMode);
  const editableStyles = useSelector(selectCurrentEditableStyles);

  const getControlStyles = useCallback(
    (controlName: string) => {
      const controlInfo = CONTROLS[controlName];
      if (!controlInfo.styles) {
        return {};
      }
      return controlInfo.styles.reduce((acc, styleName) => {
        if (!editableStyles[styleName]) {
          return acc;
        }
        return {
          ...acc,
          [styleName]: editableStyles[styleName],
        };
      }, {});
    },
    [editableStyles],
  );

  const { type } = activeElement;

  return (
    <div className={classes.propertiesTab}>
      <Scrollbar
        autoHeightMin="100%"
        style={{
          height: '100%',
        }}
      >
        {type !== 'none' && !isPrototypeMode && (
          <>
            {AVAILABLE_CONTROLS[type as Entity].map((controlName) => {
              if (isFreeCanvasMode && controlName === 'size') {
                return null;
              }
              const controlInfo = CONTROLS[controlName];
              const { Control } = controlInfo;

              return (
                <ControlSection key={controlName} title={controlName}>
                  <Control {...getControlStyles(controlName)} />
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
