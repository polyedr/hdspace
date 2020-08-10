import React, { ChangeEvent } from 'react';
import cn from 'classnames';
import { makeStyles, Radio } from '@material-ui/core';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import * as R from 'ramda';

import { RadioRendererProps } from '../types';

const styles = require('../styles.scss');

const getRadiobuttonClassStyles = (style: React.CSSProperties) => ({
  color: style.backgroundColor,
  '&$checked': {
    color: style.backgroundColor,
  },
});

const getRadiobuttonStyles = (
  entityStyles: React.CSSProperties,
  groupStyles: React.CSSProperties,
  ownStyles: React.CSSProperties,
) =>
  makeStyles({
    root: {},

    entityStyles: {
      ...getRadiobuttonClassStyles(entityStyles),
    },

    groupStyles: {
      ...getRadiobuttonClassStyles(groupStyles),
    },

    ownStyles: {
      ...getRadiobuttonClassStyles(ownStyles),
    },
  });

const getIconClassStyles = (styles: React.CSSProperties) => ({
  width: styles.width,
  height: styles.height,
});

const getIconStyles = (
  entityStyles: React.CSSProperties,
  groupStyles: React.CSSProperties,
  ownStyles: React.CSSProperties,
) =>
  makeStyles({
    entityStyles: {
      ...getIconClassStyles(entityStyles),
    },

    groupStyles: {
      ...getIconClassStyles(groupStyles),
    },

    ownStyles: {
      ...getIconClassStyles(ownStyles),
    },
  });

const getDivStyles = (
  entityStyles: React.CSSProperties,
  groupStyles: React.CSSProperties,
  ownStyles: React.CSSProperties,
) =>
  makeStyles({
    entityStyles: {
      ...R.omit(['backgroundColor', 'width', 'height'], entityStyles),
      display: 'inline-block',
    },

    groupStyles: {
      ...R.omit(['backgroundColor', 'width', 'height'], groupStyles),
      display: 'inline-block',
    },

    ownStyles: {
      ...R.omit(['backgroundColor', 'width', 'height'], ownStyles),
      display: 'inline-block',
    },
  });

const Radiobutton: React.FC<RadioRendererProps> = ({
  id,
  entityStyles,
  groupStyles,
  ownStyles,
  params,
  isDisabled,
  sortableId,
  isRadioChecked,
  onElementChange,
  className,
  elementRef,
}) => {
  const { name, value, showRipple } = params;

  const radiobuttonClasses = getRadiobuttonStyles(
    entityStyles,
    groupStyles,
    ownStyles,
  )();
  const iconClasses = getIconStyles(entityStyles, groupStyles, ownStyles)();
  const divClasses = getDivStyles(entityStyles, groupStyles, ownStyles)();

  const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
    onElementChange(name || '', event.target.value);
  };

  return (
    <div
      ref={elementRef}
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn(
        className,
        isDisabled && styles.disabled,
        divClasses.entityStyles,
        divClasses.groupStyles,
        divClasses.ownStyles,
      )}
      tabIndex={isDisabled ? 0 : -1}
    >
      <Radio
        checkedIcon={
          <RadioButtonCheckedIcon
            className={cn(
              iconClasses.entityStyles,
              iconClasses.groupStyles,
              iconClasses.ownStyles,
            )}
          />
        }
        icon={
          <RadioButtonUncheckedIcon
            className={cn(
              iconClasses.entityStyles,
              iconClasses.groupStyles,
              iconClasses.ownStyles,
            )}
          />
        }
        color="default"
        className={cn(
          radiobuttonClasses.root,
          radiobuttonClasses.entityStyles,
          radiobuttonClasses.groupStyles,
          radiobuttonClasses.ownStyles,
        )}
        value={value}
        name={name}
        checked={isRadioChecked}
        onChange={handleRadioChange}
        disableRipple={!showRipple}
      />
    </div>
  );
};

export { Radiobutton };
