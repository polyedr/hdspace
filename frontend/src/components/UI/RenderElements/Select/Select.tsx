// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { makeStyles, MenuItem, TextField } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { SelectRendererProps } from '../types';
import { selectElementAsTree } from '../../../../redux/project/selectors';
import { LibraryElement } from '../../../../types';
import { makeComponentStyles } from '../styles';

const useWrapperStyles = makeComponentStyles({
  root: {
    '&.hovered $input': {
      outline: '1px solid #949494',
    },
  },
});

const useTextFieldStyles = makeStyles({
  root: {
    height: '100%',
    border: 0,

    '& fieldset': {
      border: 0,
    },
  },
});

const useMenuStyles = makeComponentStyles(
  {},
  ['margin', 'padding'],
  (styles: React.CSSProperties) => ({
    minWidth: styles.width,
  }),
);

const useInputStyles = makeComponentStyles(
  {
    root: ({ isDisabled }: SelectRendererProps) => ({
      height: '100%',
      boxSizing: 'border-box',
      outlineOffset: '-1px',

      '&:hover': {
        ...(!isDisabled && { borderColor: 'rgba(0, 0, 0, 0.87)' }),
      },
    }),
  },
  [
    'width',
    'height',
    'marginTop',
    'marginRight',
    'marginBottom',
    'marginLeft',
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
  ],
  (style: React.CSSProperties) => ({
    '& .MuiSelect-outlined.MuiSelect-outlined': {
      paddingTop: style.paddingTop,
      paddingRight: `calc(${style.paddingRight} + 18px)`,
      paddingBottom: style.paddingBottom,
      paddingLeft: style.paddingLeft,
    },

    '&::placeholder': {
      color: style.color,
    },
  }),
);

const useDivStyles = makeStyles(() => {
  const processDivStyles = (styles: React.CSSProperties) => {
    const { marginTop, marginBottom, marginLeft, marginRight } = styles;
    return {
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
      position: 'relative',
      display: 'inline-block',
      verticalAlign: 'top',
    };
  };
  return {
    entityStyles: ({ entityStyles }) => processDivStyles(entityStyles),
    groupStyles: ({ groupStyles }) => processDivStyles(groupStyles),
    ownStyles: ({ ownStyles }) => processDivStyles(ownStyles),
  };
});

const Select: React.FC<SelectRendererProps> = React.forwardRef((props, ref) => {
  const {
    id,
    isDisabled,
    onElementChange,
    params,
    children,
    className, // -
    childrenElements,
    projectClasses,
  } = props;
  const { isOpen } = params;

  const classes = useWrapperStyles(props);
  const divClasses = useDivStyles(props);
  const textFieldClasses = useTextFieldStyles(props);
  const inputClasses = useInputStyles(props);

  const menu = useSelector(selectElementAsTree(childrenElements[0]));
  const [menuEntityClass, menuGroupClass] = menu.styles.classNames;

  const menuEntityStyles =
    projectClasses?.find((cssClass) => cssClass.className === menuEntityClass)
      ?.rules || {};
  const menuGroupStyles =
    projectClasses?.find((cssClass) => cssClass.className === menuGroupClass)
      ?.rules || {};

  const menuClasses = useMenuStyles({
    entityStles: menuEntityStyles,
    groupStyles: menuGroupStyles,
    ownStyles: menu.styles.own,
  });

  // const menuItemClasses = useMenuItemStyles(props);

  const menuItems: LibraryElement<'selectItem'> = menu.children;
  const currentValue = params.value || menuItems[0]?.parameters?.value;

  const PrototypeMenuProps = {
    MenuProps: {
      PaperProps: {
        className: cn(
          menuClasses.entityStyles,
          menuClasses.groupStyles,
          menuClasses.ownStyles,
        ),
      },
    },
  };

  const InputProps = {
    className: cn(
      isDisabled && classes.disabled,
      inputClasses.root,
      inputClasses.entityStyles,
      inputClasses.groupStyles,
      inputClasses.ownStyles,
    ),
  };

  return (
    <div
      key={id}
      ref={ref}
      className={cn(
        className,
        classes.root,
        divClasses.entityStyles,
        divClasses.groupStyles,
        divClasses.ownStyles,
      )}
    >
      <TextField
        id={id}
        data-ls-id={id}
        variant="outlined"
        className={cn(
          textFieldClasses.root,
          isDisabled ? classes.disabled : '',
          textFieldClasses.entityStyles,
          textFieldClasses.groupStyles,
          textFieldClasses.ownStyles,
        )}
        value={currentValue}
        InputProps={InputProps}
        SelectProps={!isDisabled ? PrototypeMenuProps : null}
        onChange={onElementChange}
        select
      >
        {menuItems.map((item) => (
          <MenuItem
            key={item.id}
            value={item.parameters.value}
            className={cn(menuClasses.entityStyles, menuClasses.groupStyles)}
          >
            {item.parameters.name}
          </MenuItem>
        ))}
      </TextField>
      {isOpen && children}
    </div>
  );
});

export default Select;
