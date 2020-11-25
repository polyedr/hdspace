// @ts-nocheck

import React, { useCallback, useMemo } from 'react';
import cn from 'classnames';
import { TextField } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { SelectRendererProps } from '../types';
import { selectElementAsTree } from '../../../../redux/project/selectors';
import { LibraryElement } from '../../../../types';
import { makeComponentStyles } from '../styles';

import SelectItem from './SelectItem';

// const styles = require('../styles.scss');

/* const getTextFieldClassStyles = (style: React.CSSProperties) => ({
  '&$focused $input': {
    borderRadius: style.borderRadius,
  },

  input: {},
});

const getTextFieldStyles = (
  entityStyles: React.CSSProperties,
  groupStyles: React.CSSProperties,
  ownStyles: React.CSSProperties,
) =>
  makeStyles({
    root: {
      height: '100%',

      '& fieldset': {
        border: 0,
      },

      '&$focused $input': {
        borderColor: '#1890ff',
        boxShadow: 'inset 0px 0px 0 1px #1890ff',
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

const getInputClassStyles = (style: React.CSSProperties) => ({
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
    style,
  ),

  '& .MuiSelect-outlined.MuiSelect-outlined': {
    paddingTop: style.paddingTop,
    paddingRight: `calc(${style.paddingRight} + 18px)`,
    paddingBottom: style.paddingBottom,
    paddingLeft: style.paddingLeft,
  },

  '&::placeholder': {
    color: style.color,
  },
});

const getInputStyles = (
  isDisabled: boolean,
  entityStyles: React.CSSProperties,
  groupStyles: React.CSSProperties,
  ownStyles: React.CSSProperties,
) =>
  makeStyles({
    root: {
      height: '100%',
      boxSizing: 'border-box',
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
  ownStyles: React.CSSProperties,
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
  }); */

/* const getMenuClassStyles = (style: React.CSSProperties) => ({
  ...style,
  minWidth: style.width,
});

const getMenuStyles = (
  entityStyles: React.CSSProperties,
  groupStyles: React.CSSProperties,
  ownStyles: React.CSSProperties,
) =>
  makeStyles({
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
  ownStyles: React.CSSProperties,
) =>
  makeStyles({
    entityStyles: {
      ...R.pick(
        ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'],
        entityStyles,
      ),
      position: 'relative',
      display: 'inline-block',
      verticalAlign: 'top',
    },

    groupStyles: {
      ...R.pick(
        ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'],
        groupStyles,
      ),
      position: 'relative',
      display: 'inline-block',
      verticalAlign: 'top',
    },

    ownStyles: {
      ...R.pick(
        ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'],
        ownStyles,
      ),
      position: 'relative',
      display: 'inline-block',
      verticalAlign: 'top',
    },
  }); 

const Select: React.FC<SelectRendererProps> = React.forwardRef((props, ref) => {
  const {
    id,
    entityStyles,
    groupStyles,
    ownStyles,
    isDisabled,
    onElementChange,
    params,
    children,
    className, // -
    childrenElements,
    projectClasses,
  } = props;
  const { isOpen } = params;

  const handleSelectChange = (
    event: ChangeEvent<{ name?: string | undefined; value: any }>,
  ) => {
    onElementChange(id, event.target.value);
  };

  const entityInlineStyles = R.pick(['width', 'height'], entityStyles);
  const groupInlineStyles = R.pick(['width', 'height'], groupStyles);
  const ownInlineStyles = R.pick(['width', 'height'], ownStyles);
  const inlineStyles = {
    ...entityInlineStyles,
    ...groupInlineStyles,
    ...ownInlineStyles,
  };

  const menu = useSelector(selectElementById(childrenElements[0]));

  const menuItems: LibraryElement<'selectItem'> = menu.children;
  const currentValue = menuItems[0]?.parameters?.value;

  const textFieldClasses = getTextFieldStyles(
    entityStyles,
    groupStyles,
    ownStyles,
  )();
  const inputClasses = getInputStyles(
    isDisabled,
    entityStyles,
    groupStyles,
    ownStyles,
  )();
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

  const menuEntityStyles =
    projectClasses?.find((cssClass) => cssClass.className === menuEntityClass)
      ?.rules || {};
  const menuGroupStyles =
    projectClasses?.find((cssClass) => cssClass.className === menuGroupClass)
      ?.rules || {};

  const menuClasses = getMenuStyles(
    menuEntityStyles,
    menuGroupStyles,
    menu.styles.ownStyles,
  )();

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
      isDisabled && styles.disabled,
      inputClasses.root,
      inputClasses.entityStyles,
      inputClasses.groupStyles,
      inputClasses.ownStyles,
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
      >
        <TextField
          ref={ref}
          id={id}
          data-ls-id={id}
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
        {menuItems.map((menuItem) => {
          /* const {
            id: itemID,
            parameters: { name, value, showRipple },
            styles: menuItemStyles,
          } = menuItem;
          const [entityClass, groupClass] = menuItemStyles.classNames;

           const menuItemEntityStyles =
            projectClasses?.find(
              (cssClass) => cssClass.className === entityClass,
            )?.rules || {};
          const menuItemGroupStyles =
            projectClasses?.find(
              (cssClass) => cssClass.className === groupClass,
            )?.rules || {};

           const menuItemClasses = getMenuItemClasses(
            menuItemEntityStyles,
            menuItemGroupStyles,
            styles.ownStyles,
          )();

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
        })}
      </TextField>
    </div>
  );
}); */

const useStyles = makeComponentStyles(
  {
    root: {
      height: '100%',
      '&.hovered $input': {
        outline: '1px solid #949494',
      },

      '& fieldset': {
        border: 0,
      },

      '&$focused $input': {
        borderColor: '#1890ff',
        boxShadow: 'inset 0px 0px 0 1px #1890ff',
      },
    },
    input: {},
  },
  [],
  (style: CSSProperties) => ({
    '&$focused $input': {
      borderRadius: style.borderRadius,
    },
  }),
);

const useTextFieldStyles = makeComponentStyles(
  {
    root: {
      height: '100%',

      '& fieldset': {
        border: 0,
      },

      '&$focused $input': {
        borderColor: '#1890ff',
        boxShadow: 'inset 0px 0px 0 1px #1890ff',
      },
    },
  },
  [],
  (style: CSSProperties) => ({
    borderRadius: style.borderRadius,
  }),
);

const useInlineStyles = ({ entityStyles, groupStyles, ownStyles }) => {
  const processInlineStyles = useCallback((style: CSSProperties) => {
    const { width, height } = style;
    return { width, height };
  }, []);

  return useMemo(
    () => ({
      entityStyles: processInlineStyles(entityStyles),
      groupStyles: processInlineStyles(groupStyles),
      ownStyles: processInlineStyles(ownStyles),
    }),
    [processInlineStyles, entityStyles, groupStyles, ownStyles],
  );
};

const useMenuStyles = makeComponentStyles({}, [], (styles: CSSProperties) => ({
  minWidth: styles.width,
}));

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

  const handleSelectChange = useCallback(
    (event: React.ChangeEvent<{ name?: string | undefined; value: any }>) => {
      onElementChange(id, event.target.value);
    },
    [id, onElementChange],
  );

  const inlineStyles = useInlineStyles(props);

  const classes = useStyles(props);
  const textFieldClasses = useTextFieldStyles(props);

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

  const menuItems: LibraryElement<'selectItem'> = menu.children;
  const currentValue = menuItems[0]?.parameters?.value;

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
      /* inputClasses.root,
      inputClasses.entityStyles,
      inputClasses.groupStyles,
      inputClasses.ownStyles, */
    ),
  };
  return (
    <div
      key={id}
      className={cn(
        className,
        classes.root,
        classes.entityStyles,
        classes.groupStyles,
        classes.ownStyles,
      )}
    >
      <TextField
        ref={ref}
        id={id}
        data-ls-id={id}
        style={inlineStyles}
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
        onChange={handleSelectChange}
        select
      >
        {menuItems.map((item) => (
          <SelectItem key={`item-${item.id}`} item={item} />
        ))}
      </TextField>
      {isOpen && children}
    </div>
  );
});

export default Select;
