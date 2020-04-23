import { IScreenProps, IScenarioElement } from "$redux/project/types";

type SharedRendererProps = {
  id: string;
  style: React.CSSProperties,
  params: IScreenProps,
  sortableId: string,
  active: boolean,
  isDisabled: boolean,
};

type ActionRendererProps = {
  onClick?(event: any): void,
};

type CheckboxRendererProps = {
  isCheckboxChecked: boolean,
  onChange(itemID: string, savedValue: boolean): void,
};

type InputRendererProps = {
  inputValue: string,
  onChange(itemID: string, savedValue: string): void,
};

type TextareaRendererProps = {
  textareaValue: string,
  onChange(itemID: string, savedValue: string): void,
};

type RadioRendererProps = {
  isRadioChecked: boolean,
  onChange(itemID: string, savedValue: string): void,
};

type SelectRendererProps = {
  selectValue: string,
  onChange(itemID: string, savedValue: string): void,
  childrenElements: IScenarioElement[],
}

export type RendererProps = SharedRendererProps &
  ActionRendererProps &
  SharedRendererProps &
  CheckboxRendererProps &
  RadioRendererProps &
  InputRendererProps &
  TextareaRendererProps &
  SelectRendererProps;

export type Renderer = React.FC<RendererProps>;
