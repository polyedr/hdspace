import { IScreenProps, IScenarioElement } from "$redux/project/types";

export type RendererProps = {
  id: string;
  style: React.CSSProperties;
  params: IScreenProps;
  name?: string;
  orientation?: string;
  active?: boolean;
  isDisabled?: boolean;
  children?: JSX.Element;
  sortableId?: string;
  selectValue: string;
  savedElement: { id: number, savedValue: string | boolean };
  selectDefaultValue?: string;
  isRadioChecked?: boolean;
  isCheckboxChecked?: boolean;
  childrenElements: IScenarioElement[];
  onClick?(event: any): void;
  onChange(itemID: string, savedValue: string | boolean): void;
};

export type Renderer = React.FC<RendererProps>;
