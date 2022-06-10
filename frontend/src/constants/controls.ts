import BackgroundBlock from '@Components/RightPanel/PropertiesTab/Controls/BackgroundBlock';
import BackgroundSize from '@Components/RightPanel/PropertiesTab/Controls/BackgroundSize';
import BorderBlock from '@Components/RightPanel/PropertiesTab/Controls/BorderBlock';
import Bullets from '@Components/RightPanel/PropertiesTab/Controls/Bullets';
import ColumnsControls from '@Components/RightPanel/PropertiesTab/Controls/ColumnsControls';
import Display from '@Components/RightPanel/PropertiesTab/Controls/Display/Display';
import DropdownItems from '@Components/RightPanel/PropertiesTab/Controls/DropdownItems';
import FlexGrow from '@Components/RightPanel/PropertiesTab/Controls/FlexGrow';
import GridControl from '@Components/RightPanel/PropertiesTab/Controls/GridControl';
import Image from '@Components/RightPanel/PropertiesTab/Controls/Image/Image';
import HeadingType from '@Components/RightPanel/PropertiesTab/Controls/HeadingType/HeadingType';
import IndentsBlock from '@Components/RightPanel/PropertiesTab/Controls/IndentsBlock';
import IsOpen from '@Components/RightPanel/PropertiesTab/Controls/IsOpen/IsOpen';
import LabelFor from '@Components/RightPanel/PropertiesTab/Controls/LabelFor/LabelFor';
import LayoutsControl from '@Components/RightPanel/PropertiesTab/Controls/LayoutsControl';
import ListItems from '@Components/RightPanel/PropertiesTab/Controls/ListItems';
import MapProps from '@Components/RightPanel/PropertiesTab/Controls/MapProps/MapProps';
import Name from '@Components/RightPanel/PropertiesTab/Controls/Name/Name';
import NativeColumnsControls from '@Components/RightPanel/PropertiesTab/Controls/NativeColumns';
import Ordered from '@Components/RightPanel/PropertiesTab/Controls/Ordered/Ordered';
import Placeholder from '@Components/RightPanel/PropertiesTab/Controls/Placeholder/Placeholder';
import Ripple from '@Components/RightPanel/PropertiesTab/Controls/Ripple/Ripple';
import SelectOptions from '@Components/RightPanel/PropertiesTab/Controls/SelectOptions';
import SelectValue from '@Components/RightPanel/PropertiesTab/Controls/SelectValue/SelectValue';
import SizeBlock from '@Components/RightPanel/PropertiesTab/Controls/SizeBlock/SizeBlock';
import StylesOn from '@Components/RightPanel/PropertiesTab/Controls/StylesOn/StylesOn';
import TextContent from '@Components/RightPanel/PropertiesTab/Controls/TextContent/TextContent';
import Type from '@Components/RightPanel/PropertiesTab/Controls/Type/Type';
import TypographyBlock from '@Components/RightPanel/PropertiesTab/Controls/TypographyBlock';
import Value from '@Components/RightPanel/PropertiesTab/Controls/Value/Value';
import VideoSettings from '@Components/RightPanel/PropertiesTab/Controls/VideoSettings/VideoSettings';
import withSmartContainerControl from '@Components/RightPanel/PropertiesTab/Controls/SmartContainerControl/withSmartContainerControl';
import { Control, NNBlockType } from '@Src/types';
import Alt from '@Components/RightPanel/PropertiesTab/Controls/Alt';
import Title from '@Components/RightPanel/PropertiesTab/Controls/Title';
import StyleSheets from '@Components/RightPanel/PropertiesTab/Controls/StyleSheets/StyleSheets';
import Attributes from '@Components/RightPanel/PropertiesTab/Controls/Attributes/Attributes';
import TagName from '@Components/RightPanel/PropertiesTab/Controls/TagName/TagName';
import BreadcrumbItems from '@Components/RightPanel/PropertiesTab/Controls/BreadcrumblItems/BreadcrumbItems';
import PaginationItems from '@Components/RightPanel/PropertiesTab/Controls/PaginationItems/PaginationItems';
import CarouselItems from '@Components/RightPanel/PropertiesTab/Controls/CarouselItems/CarouselItems';
import ResizeOptionsControl from '@Components/RightPanel/PropertiesTab/Controls/ResizeOptions';
import NavbarItems from '@Components/RightPanel/PropertiesTab/Controls/NavbarItems/NavbarItems';
import Radiobuttons from '@Components/RightPanel/PropertiesTab/Controls/Radiobuttons';
import Alignment from '@Components/RightPanel/PropertiesTab/Controls/Alignment';
import BackgroundImage from '@Components/RightPanel/PropertiesTab/Controls/BackgroundImage';
import Text from '@Components/RightPanel/PropertiesTab/Controls/Text/Text';
import ImagesItems from '@Components/RightPanel/PropertiesTab/Controls/ImagesItems/ImagesItems';
import SliderSettings from '@Components/RightPanel/PropertiesTab/Controls/SliderSettings/SliderSettings';
import DateTimePickerControls from '@Components/RightPanel/PropertiesTab/Controls/DateTimePickerControls/DateTimePickerControls';
import OpacityBlock from '@Components/RightPanel/PropertiesTab/Controls/OpacityBlock/OpacityBlock';

type ControlInfo = {
  Control: React.ComponentType<any>;
  styles?: Array<keyof React.CSSProperties>;
  isDefaultStyles?: boolean;
};

const CONTROLS: Record<Control, ControlInfo> = {
  layouts: {
    Control: LayoutsControl,
  },
  display: {
    Control: Display,
    styles: ['display', 'justifyContent', 'alignItems', 'flexDirection'],
  },
  sliderSettings: {
    Control: SliderSettings,
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
  opacity: { Control: OpacityBlock, styles: ['opacity'] },
  typography: {
    Control: TypographyBlock,
    styles: [
      'fontFamily',
      'fontSize',
      'fontWeight',
      'lineHeight',
      'letterSpacing',
      'verticalAlign',
      'textAlign',
      'opacity',
      'color',
    ],
  },
  border: {
    Control: BorderBlock,
    styles: [
      'borderColor',
      'borderWidth',
      'borderRadius',
      'borderStyle',
      'borderRightWidth',
      'borderTopWidth',
      'borderBottomWidth',
      'borderLeftWidth',
    ],
  },
  background: { Control: BackgroundBlock, styles: ['backgroundColor'] },
  backgroundImage: { Control: BackgroundImage, styles: ['backgroundImage'] },
  mapProps: { Control: MapProps },
  placeholder: { Control: Placeholder },
  textContent: { Control: TextContent, styles: [] },
  dateTimePickerControls: { Control: DateTimePickerControls },
  text: { Control: Text, styles: [] },
  image: { Control: Image, styles: [] },
  imagesList: {
    Control: ImagesItems,
    styles: [],
  },
  alt: { Control: Alt },
  title: { Control: Title },
  smartHeader: { Control: withSmartContainerControl(NNBlockType.HEADER) },
  smartFooter: { Control: withSmartContainerControl(NNBlockType.FOOTER) },
  smartForm: { Control: withSmartContainerControl(NNBlockType.FORM) },
  smartWebpage: { Control: withSmartContainerControl(NNBlockType.WEBPAGE) },
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
  styleSheets: { Control: StyleSheets },
  attributes: { Control: Attributes },
  tagName: { Control: TagName },
  breadcrumb: { Control: BreadcrumbItems },
  pagination: { Control: PaginationItems },
  carousel: { Control: CarouselItems },
  resizeOptions: { Control: ResizeOptionsControl },
  navbar: { Control: NavbarItems },
  radiobuttons: {
    Control: Radiobuttons,
  },
  alignment: {
    Control: Alignment,
    styles: ['flexDirection'],
  },
};

export default CONTROLS;
