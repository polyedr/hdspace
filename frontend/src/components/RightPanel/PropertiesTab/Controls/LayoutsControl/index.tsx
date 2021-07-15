import { makeStyles } from '@material-ui/core/styles';
import { selectActiveElementParams } from '@Redux/project/selectors/element';
import {
  Entity,
  Layout,
  baseLayout,
  LibraryElement,
  PropertiesChangeProps,
} from '@Src/types';
import React, { ChangeEvent, FC } from 'react';
import { useSelector } from 'react-redux';

import { Checkbox, FormControlLabel } from '@material-ui/core';

const useFormControlLabelStyles = makeStyles(({ palette }) => ({
  label: {
    '&.Mui-disabled': {
      color: palette.grey.A200,
    },
  },
}));

const useCheckboxStyles = makeStyles(({ palette }) => ({
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

  const list = Object.keys(Layout).map((k) => Layout[k] as Layout);

  const handleChange = (
    { target: { checked } }: ChangeEvent<HTMLInputElement>,
    layout: Layout,
  ) => {
    if (!checked && layouts.length === 1) return;
    const newLayouts = checked
      ? [...layouts, layout]
      : layouts.filter((l) => l !== layout);

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
