import React, { ChangeEvent } from 'react';
import cn from 'classnames';
import { makeStyles, TextField, MenuItem } from '@material-ui/core';
import * as R from 'ramda';

import { convertPropCSS } from '$utils/StyleHelper';

import { SelectRendererProps } from '../types';
const styles = require('../styles.scss');

const getTextFieldClassStyles = (styles: React.CSSProperties) => ({
  '&$focused $input': {
    borderRadius: styles.borderRadius,
  },

  input: {},
});

const getTextFieldStyles = (
  entityStyles: React.CSSProperties,
  groupStyles: React.CSSProperties,
  ownStyles: React.CSSProperties,
) => makeStyles({
  root: {
    height: '100%',

    '& fieldset': {
      border: 0,
    },

    '&$focused $input': {
      borderColor: '#1890ff',
      boxShadow: 'inset 0px 0px 0 1px #1890ff'
    },
  },

  input: {},

  focused: {},

  entityStyles: {
    ...getTextFieldClassStyles(entityStyles),
  },

  groupStyles: {
    ...getTextFieldClassStyles(groupStyles),
  },

  ownStyles: {
    ...getTextFieldClassStyles(ownStyles),
  },
});

const getInputClassStyles = (styles: React.CSSProperties) => ({
  ...R.omit(
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
    styles
  ),

  '& .MuiSelect-outlined.MuiSelect-outlined': {
    paddingTop: styles.paddingTop,
    paddingRight: `calc(${styles.paddingRight} + 18px)`,
    paddingBottom: styles.paddingBottom,
    paddingLeft: styles.paddingLeft,
  },

  '&::placeholder': {
    color: styles.color,
  },
});

const getInputStyles = (
  isDisabled: boolean,
  active: boolean,
  entityStyles: React.CSSProperties,
  groupStyles: React.CSSProperties,
  ownStyles: React.CSSProperties,
) => makeStyles({
  root: {
    height: '100%',
    boxSizing: 'border-box',
    outline: active ? '1px red solid' : 'none',
    outlineOffset: '-1px',

    '&:hover': {
      ...(!isDisabled && { borderColor: 'rgba(0, 0, 0, 0.87)' }),
    },
  },

  entityStyles: {
    ...getInputClassStyles(entityStyles),
  },

  groupStyles: {
    ...getInputClassStyles(groupStyles),
  },

  ownStyles: {
    ...getInputClassStyles(ownStyles),
  },
});

const getMenuItemClasses = (
  entityStyles: React.CSSProperties,
  groupStyles: React.CSSProperties,
  ownStyles: React.CSSProperties
) =>
  makeStyles({
    root: {
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
      },
    },

    entityStyles: {
      ...entityStyles,
    },

    groupStyles: {
      ...groupStyles,
    },

    ownStyles: {
      ...ownStyles,
    },
});

const getMenuClassStyles = (styles: React.CSSProperties) => ({
  ...styles,
  minWidth: styles.width,
});

const getMenuStyles = (
  entityStyles: React.CSSProperties,
  groupStyles: React.CSSProperties,
  ownStyles: React.CSSProperties,
) => makeStyles({
  entityStyles: {
    ...getMenuClassStyles(entityStyles),
  },

  groupStyles: {
    ...getMenuClassStyles(groupStyles),
  },

  ownStyles: {
    ...getMenuClassStyles(ownStyles),
  },
});

const getDivClasses = (
  entityStyles: React.CSSProperties,
  groupStyles: React.CSSProperties,
  ownStyles: React.CSSProperties
) =>
  makeStyles({
    entityStyles: {
      ...R.pick(['marginTop', 'marginRight', 'marginBottom', 'marginLeft'], entityStyles),
      position: 'relative',
      display: 'inline-block',
      verticalAlign: 'top',
    },

    groupStyles: {
      ...R.pick(['marginTop', 'marginRight', 'marginBottom', 'marginLeft'], groupStyles),
      position: 'relative',
      display: 'inline-block',
      verticalAlign: 'top',
    },

    ownStyles: {
      ...R.pick(['marginTop', 'marginRight', 'marginBottom', 'marginLeft'], ownStyles),
      position: 'relative',
      display: 'inline-block',
      verticalAlign: 'top',
    },
});

const SelectComponent = (props: SelectRendererProps) => {
  const {
    id,
    entityStyles,
    groupStyles,
    ownStyles,
    isDisabled,
    active,
    sortableId,
    currentValue,
    onElementChange,
    params,
    children,
    className,
    elementRef,
    childrenElements,
    projectClasses,
  } = props;
  
  const { isOpen } = params;

  const handleSelectChange = (event: ChangeEvent<{ name?: string | undefined; value: any; }>) => {
    onElementChange(id, event.target.value);
  };

  const entityInlineStyles = R.pick(['width', 'height'], entityStyles);
  const groupInlineStyles = R.pick(['width', 'height'], groupStyles);
  const ownInlineStyles = R.pick(['width', 'height'], ownStyles);
  const inlineStyles = { ...entityInlineStyles, ...groupInlineStyles, ...ownInlineStyles};


  const [menu] = childrenElements;
  const menuItems = menu.children;

  const textFieldClasses = getTextFieldStyles(entityStyles, groupStyles, ownStyles)();
  const inputClasses = getInputStyles(isDisabled, active, entityStyles, groupStyles, ownStyles)();
  const divClasses = getDivClasses(entityStyles, groupStyles, ownStyles)();

  const wrapperClasses = makeStyles({
    root: {
      '&.hovered $input': {
        outline: '1px solid #949494',
      },
    },

    input: {},
  })();

  const [menuEntityClass, menuGroupClass] = menu.styles.classNames;

  const menuEntityStyles = projectClasses?.find(cssClass => cssClass.className === menuEntityClass)?.rules || {};
  const menuGroupStyles = projectClasses?.find(cssClass => cssClass.className === menuGroupClass)?.rules || {};
  
  const convertedMenuEntityStyles = convertPropCSS(menuEntityStyles);
  const convertedGroupStyles = convertPropCSS(menuGroupStyles);
  const menuOwnStyles = convertPropCSS(menu.styles.ownStyles);

  const menuClasses = getMenuStyles(convertedMenuEntityStyles, convertedGroupStyles, menuOwnStyles)();

  const PrototypeMenuProps = {
    MenuProps: {
      PaperProps: {
        className: cn(menuClasses.entityStyles, menuClasses.groupStyles, menuClasses.ownStyles),
      },
    },
  };

  const InputProps = {
    className: cn(
      isDisabled && styles.disabled,
      inputClasses.root,
      inputClasses.entityStyles,
      inputClasses.groupStyles,
      inputClasses.ownStyles
    ),
  };

  return isDisabled ? (
    <>
      <div
        key={id}
        className={cn(
          className,
          wrapperClasses.root,
          divClasses.entityStyles,
          divClasses.groupStyles,
          divClasses.ownStyles,
        )}
        tabIndex={isDisabled ? 0 : -1}
      >
        <TextField
          ref={elementRef}
          id={id}
          data-ls-id={id}
          data-id={sortableId}
          style={inlineStyles}
          variant="outlined"
          className={cn(
            textFieldClasses.root,
            styles.disabled,
            textFieldClasses.entityStyles,
            textFieldClasses.groupStyles,
            textFieldClasses.ownStyles,
          )}
          value={currentValue}
          InputProps={InputProps}
          select
        >
          {menuItems.map(({ id: itemID, parameters: { name, value } }) => (
            <MenuItem key={itemID} value={value}>
              {name}
            </MenuItem>
          ))}
        </TextField>
        {isOpen && children}
      </div>
    </>
  ) : (
    <div
      className={cn(
        divClasses.entityStyles,
        divClasses.groupStyles,
        divClasses.ownStyles,
      )}
    >
      <TextField
        id={id}
        key={id}
        variant="outlined"
        style={inlineStyles}
        className={cn(
          textFieldClasses.root,
          textFieldClasses.entityStyles,
          textFieldClasses.groupStyles,
          textFieldClasses.ownStyles,
        )}
        value={currentValue}
        onChange={handleSelectChange}
        InputProps={InputProps}
        SelectProps={PrototypeMenuProps}
        select
      >
        {menuItems.map(
          (menuItem) => {
            const { id: itemID, parameters: { name, value, showRipple }, styles } = menuItem;
            const [entityClass, groupClass] = menuItem.styles.classNames;

            const entityStyles = projectClasses?.find(cssClass => cssClass.className === entityClass)?.rules || {};
            const groupStyles = projectClasses?.find(cssClass => cssClass.className === groupClass)?.rules || {};
            
            const convertedEntityStyles = convertPropCSS(entityStyles);
            const convertedGroupStyles = convertPropCSS(groupStyles);
            const ownStyles = convertPropCSS(styles.ownStyles);

            const menuItemClasses = getMenuItemClasses(convertedEntityStyles, convertedGroupStyles, ownStyles)();

            return (
              <MenuItem
                key={itemID}
                value={value}
                className={cn(
                  menuItemClasses.root,
                  menuItemClasses.entityStyles,
                  menuItemClasses.groupStyles,
                  menuItemClasses.ownStyles,
                )}
                disableRipple={!showRipple}
              >
                {name}
              </MenuItem>
            );
          }
        )}
      </TextField>
    </div>
  );
};

export { SelectComponent as Select };
