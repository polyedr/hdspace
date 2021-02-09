import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  selectActiveElement,
  selectCurrentEditableStyles,
  selectSelectedElements,
  selectSelectedElementsIds,
} from '@Redux/project/selectors/element';
import {
  selectEditableStyles,
  selectFreeCanvasMode,
} from '@Redux/project/selectors/base';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import { AVAILABLE_CONTROLS } from '@Domain/core';
import { Control, Entity, NNBlockType, Params, PropertyName } from '@Src/types';
import {
  removeMultipleElementsStyles,
  removeSharedStyles,
  updateElementParameters,
  updateMultipleElementsStyles,
  updateSharedStyles,
} from '@Redux/project/actions';
import { ALL_ELEMENTS_INDEX, UNIQUE_CONTROLS } from '@Constants/defaultParams';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import GridControl from '@Components/RightPanel/PropertiesTab/Controls/GridControl';
import ColumnsControls from '@Components/RightPanel/PropertiesTab/Controls/ColumnsControls';
import RenameElement from './Controls/RenameElement/RenameElement';
import ShareStyles from './helperComponents/ShareStyles/ShareStyles';
import Display from './Controls/Display/Display';
import IndentsBlock from './Controls/IndentsBlock';
import SizeBlock from './Controls/SizeBlock/SizeBlock';
import TypographyBlock from './Controls/TypographyBlock';
import BorderBlock from './Controls/BorderBlock';
import BackgroundBlock from './Controls/BackgroundBlock';
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
import NativeColumnsControls from './Controls/NativeColumns';
import StylesOn from './Controls/StylesOn/StylesOn';
import LayoutsControl from './Controls/LayoutsControl';

type ControlInfo = {
  Control: React.ComponentType<any>;
  styles?: Array<keyof React.CSSProperties>;
};

const CONTROLS: Record<Control, ControlInfo> = {
  layouts: {
    Control: LayoutsControl,
  },
  display: {
    Control: Display,
    styles: ['display', 'justifyContent', 'alignItems', 'flexDirection'],
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
  grid: {
    Control: GridControl,
    styles: ['gridTemplateColumns', 'gridTemplateRows'],
  },
  columns: {
    Control: ColumnsControls,
  },
  nativeColumns: {
    Control: NativeColumnsControls,
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
  const dispatch = useDispatch();
  const activeElement = useSelector(selectActiveElement);
  const selectedElementsIds = useSelector(selectSelectedElementsIds);
  const isFreeCanvasMode = useSelector(selectFreeCanvasMode);
  const isPrototypeMode = useSelector(selectIsPrototypeMode);
  const currentEditableStyles = useSelector(selectCurrentEditableStyles);
  const editableStyles = useSelector(selectEditableStyles);
  const currentScreenId = useSelector(selectCurrentScreenId);
  const selectedElements = useSelector(selectSelectedElements);

  const getControlStyles = (controlName: string) => {
    const controlInfo = CONTROLS[controlName];
    if (!controlInfo.styles) {
      return {};
    }
    return controlInfo.styles.reduce((acc, styleName) => {
      if (!currentEditableStyles[styleName]) {
        return acc;
      }
      return {
        ...acc,
        [styleName]: currentEditableStyles[styleName],
      };
    }, {});
  };

  const elementsControlsCollection = Object.keys(selectedElements).map(
    (elementId) => {
      return AVAILABLE_CONTROLS[selectedElements[elementId].type];
    },
  );

  const SELECTION_CONTROLS = useMemo(() => {
    if (!elementsControlsCollection.length) {
      return [];
    }
    return elementsControlsCollection.reduce((controls, controlsList) => {
      return controls.filter(
        (control) =>
          controlsList.includes(control) && !UNIQUE_CONTROLS.includes(control),
      );
    });
  }, [elementsControlsCollection]);

  const { type } = activeElement;

  const removeStyles = useCallback(
    (ruleNames: PropertyName[]) => {
      if (editableStyles === 'ownStyles' || selectedElementsIds.length === 1) {
        dispatch(
          removeMultipleElementsStyles(selectedElementsIds, ruleNames, {
            screenId: currentScreenId,
          }),
        );
      } else if (selectedElementsIds.length > 1) {
        dispatch(
          removeSharedStyles(editableStyles as Entity, ruleNames, {
            screenId: currentScreenId,
          }),
        );
      }
    },
    [editableStyles, selectedElementsIds, dispatch, currentScreenId],
  );

  const updateStyles = useCallback(
    (styles: React.CSSProperties) => {
      if (editableStyles === 'ownStyles' || selectedElementsIds.length === 1) {
        dispatch(
          updateMultipleElementsStyles(
            selectedElementsIds,
            { [ALL_ELEMENTS_INDEX]: styles },
            { screenId: currentScreenId },
          ),
        );
      } else if (selectedElementsIds.length > 1) {
        dispatch(
          updateSharedStyles(editableStyles as Entity, styles, {
            screenId: currentScreenId,
          }),
        );
      }
    },
    [editableStyles, selectedElementsIds, dispatch, currentScreenId],
  );

  const updateParams = useCallback(
    (params: Params<any>, itemID?: string) => {
      dispatch(
        updateElementParameters(itemID || activeElement.id, params, {
          screenId: currentScreenId,
        }),
      );
    },
    [dispatch, activeElement.id, currentScreenId],
  );

  return (
    <div className={classes.propertiesTab}>
      <Scrollbar
        autoHeightMin="100%"
        style={{
          height: '100%',
        }}
      >
        {!isPrototypeMode && (
          <>
            {SELECTION_CONTROLS.map((controlName) => {
              if (isFreeCanvasMode && controlName === 'size') {
                return null;
              }
              const controlInfo = CONTROLS[controlName];
              const { Control } = controlInfo;

              return (
                <ControlSection key={controlName} title={controlName}>
                  <Control
                    {...getControlStyles(controlName)}
                    activeElementId={activeElement.id}
                    removeStyles={removeStyles}
                    updateStyles={updateStyles}
                    updateParams={updateParams}
                  />
                </ControlSection>
              );
            })}

            {type !== 'root' && elementsControlsCollection.length === 1 && (
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
