import { IScreenProps, IScenarioElement } from "$redux/project/types";

type SharedRendererProps = {
  id: string;
  style: React.CSSProperties;
  params: IScreenProps;
  sortableId: string;
};

type ActionRendererProps = {
  active: boolean,
  isDisabled: boolean,  
  onClick?(event: any): void,
};

type CheckboxRendererProps = {
  isDisabled: boolean,
  active: boolean,
  isCheckboxChecked: boolean,
  onChange(itemID: string, savedValue: string | boolean): void,
};

type InputRendererProps = {
  active: boolean,
  isDisabled: boolean,
  inputValue: string,
  onChange(itemID: string, savedValue: string | boolean): void,
};

type RadioRendererProps = {
  active: boolean,
  isDisabled: boolean,
  isRadioChecked: boolean,
  onChange(itemID: string, savedValue: string | boolean): void,
};

type SelectRendererProps = {
  active: boolean,
  isDisabled: boolean,
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
