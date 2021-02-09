import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { selectActiveElementParams } from '@Redux/project/selectors/element';
import {
  Entity,
  Layout,
  LibraryElement,
  PropertiesChangeProps,
} from '@Src/types';
import React, { ChangeEvent, FC } from 'react';
import { useSelector } from 'react-redux';

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
}) => {
  const classes = useStyles();

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
            control={
              <Checkbox
                name={layout}
                checked={layouts.includes(layout)}
                onChange={(ev) => handleChange(ev, layout)}
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
