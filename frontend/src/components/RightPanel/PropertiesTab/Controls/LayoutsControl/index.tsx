import { makeStyles } from '@mui/styles';
import React, { ChangeEvent, FC } from 'react';
import { useSelector } from 'react-redux';

import { Checkbox, FormControlLabel, Theme } from '@mui/material';
import {
  Entity,
  Layout,
  baseLayout,
  additionalLayoutTablet,
  LibraryElement,
  PropertiesChangeProps,
  additionalLayoutPhone,
} from '@Src/types';
import { selectActiveElementParams } from '@Redux/project/selectors/element';

const useFormControlLabelStyles = makeStyles<Theme>(({ palette }) => ({
  label: {
    '&.Mui-disabled': {
      color: palette.grey.A200,
    },
  },
}));

const useCheckboxStyles = makeStyles<Theme>(({ palette }) => ({
  root: {
    '&.Mui-disabled': {
      color: palette.grey.A200,
    },
  },
}));

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  label: {
    textTransform: 'capitalize',
  },
});

const LayoutsControl: FC<PropertiesChangeProps<LibraryElement<Entity>>> = ({
  updateParams,
  canEdit,
}) => {
  const classes = useStyles();
  const labelClasses = useFormControlLabelStyles();
  const checkboxClasses = useCheckboxStyles();

  const { layouts } = useSelector(selectActiveElementParams) as {
    layouts: Layout[];
  };

  const list = Object.keys(baseLayout).map((k) => Layout[k] as Layout);

  const handleChange = (
    { target: { checked } }: ChangeEvent<HTMLInputElement>,
    layout: Layout,
  ) => {
    if (!checked && layouts.length === 1) return;

    const checkedLayout = (layout) => {
      switch (layout) {
        case 'tablet':
          return [...layouts, ...additionalLayoutTablet];
        case 'mobile':
          return [...layouts, ...additionalLayoutPhone];
        default:
          return [...layouts, layout];
      }
    };

    const offLayout = (layout) => {
      switch (layout) {
        case 'tablet':
          return layouts.filter((e) => !additionalLayoutTablet.includes(e));
        case 'mobile':
          return layouts.filter((e) => !additionalLayoutPhone.includes(e));
        default:
          return layouts.filter((l) => l !== layout);
      }
    };

    const newLayouts = checked ? checkedLayout(layout) : offLayout(layout);
    updateParams({
      layouts: newLayouts,
    });
  };

  return (
    <div className={classes.root}>
      {list.map((layout) => (
        <div className={classes.label} key={layout}>
          <FormControlLabel
            classes={labelClasses}
            control={
              <Checkbox
                name={layout}
                classes={checkboxClasses}
                checked={!!layouts?.includes(layout)}
                onChange={(ev) => handleChange(ev, layout)}
                disabled={!canEdit}
              />
            }
            label={layout}
          />
        </div>
      ))}
    </div>
  );
};

export default LayoutsControl;
