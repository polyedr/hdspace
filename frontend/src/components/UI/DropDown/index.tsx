/* eslint-disable react/no-array-index-key */ // TODO: refactor this component
import React from 'react';
import classNames from 'classnames';

const styles = require('./styles.scss');

export interface IDropDownOptions<T> {
  value: T;
  label: string;
}

type Props<T> = {
  options: IDropDownOptions<T>[];
  defaultValue?: T;
  value?: T;
  disabled?: boolean;
  onChange: (value: string) => void;
};

const OPTIONS_IF_NO_SELECTED_YET: IDropDownOptions<undefined>[] = [
  {
    value: undefined,
    label: 'Select option',
  },
];

const DEFAULT_OPTIONS: IDropDownOptions<undefined>[] = [
  {
    value: undefined,
    label: 'No available options',
  },
];

type State<T> = {
  currentValue: T;
  optionsToRender: IDropDownOptions<any>[];
};

export class DropDown<T> extends React.PureComponent<Props<T>, State<T>> {
  public constructor(props: Props<T>) {
    super(props);

    const { currentValue, optionsToRender } = this.getInitialState();
    this.state = { currentValue, optionsToRender };
  }

  private getInitialState(): State<T> {
    const { defaultValue, options } = this.props;

    const hasSpecifiedDefaultValue =
      defaultValue !== undefined &&
      options.map((x) => x.value).includes(defaultValue);
    const optionsToRender: IDropDownOptions<any>[] =
      options.length === 0
        ? DEFAULT_OPTIONS
        : (hasSpecifiedDefaultValue ? [] : OPTIONS_IF_NO_SELECTED_YET).concat(
            options as any,
          );
    return {
      currentValue: hasSpecifiedDefaultValue
        ? (defaultValue as T)
        : optionsToRender[0].value,
      optionsToRender,
    };
  }

  public componentDidUpdate(prevProps: Props<T>) {
    const { value, options } = this.props;
    if (
      (prevProps.value !== value || prevProps.options !== options) &&
      value !== undefined
    ) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        currentValue: value,
        optionsToRender: options,
      });
    }
  }

  private handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { onChange } = this.props;
    onChange(event.target.value);
  };

  public render() {
    const { options, disabled } = this.props;

    const { currentValue, optionsToRender } = this.state;
    return (
      <select
        className={classNames(
          styles.dropDown,
          disabled && styles.dropDown_disabled,
        )}
        disabled={options.length === 0 || disabled}
        value={currentValue as any}
        onChange={this.handleChange}
      >
        {optionsToRender.map((x, idx) => (
          <option
            key={`option-${x.value}${idx}`}
            value={x.value}
            hidden={!x.value}
          >
            {x.label}
          </option>
        ))}
      </select>
    );
  }
}
