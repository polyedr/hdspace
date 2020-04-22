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
  onChange(itemID: string, savedValue: string | boolean): void,
};

type InputRendererProps = {
  inputValue: string,
  onChange(itemID: string, savedValue: string | boolean): void,
};

type RadioRendererProps = {
  isRadioChecked: boolean,
  onChange(itemID: string, savedValue: string | boolean): void,
};

type SelectRendererProps = {
  selectValue: string,
  onChange(itemID: string, savedValue: string | boolean): void,
  childrenElements: IScenarioElement[],
}

export type RendererProps = SharedRendererProps &
  ActionRendererProps &
  SharedRendererProps &
  CheckboxRendererProps &
  RadioRendererProps &
  InputRendererProps &
  SelectRendererProps;

export type Renderer = React.FC<RendererProps>;
