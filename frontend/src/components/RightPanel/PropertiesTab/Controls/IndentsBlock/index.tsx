import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { useSelector } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TextField from '@material-ui/core/TextField';
import { useDebounce } from 'use-debounce';
import withConfigurableProperties from '../../../../../utils/withConfigurableProperties';
import { selectCurrentEditableStyles } from '../../../../../redux/project/selectors';
import StylesHeader from '../../helperComponents/StylesHeader';
import {
  Entity,
  LibraryElement,
  PropertiesChangeProps,
} from '../../../../../types';

const useStyles = makeStyles({
  marginGrid: {
    display: 'grid',
    gridTemplateAreas: `
        '.  .  mt .  . '
        '.  pg pg pg . '
        'ml pg pg pg mr'
        '.  pg pg pg . '
        '.  .  mb .  . '  
        `,
    border: '1px solid grey',
    position: 'relative',
  },
  paddingGrid: {
    display: 'grid',
    gridArea: 'pg',
    gridTemplateAreas: `
      '.  pt . '
      'pl .  pr'
      '.  pb . '
    `,
    border: '1px solid grey',
    position: 'relative',
  },
  capture: {
    position: 'absolute',
    top: 0,
    left: 0,
    fontStyle: 'italic',
    fontSize: '0.8em',
  },
  input: {
    '& .MuiInputBase-input': {
      height: 10,
      fontSize: '0.8em',
      padding: '0.4em',
    },
  },
  marginTop: {
    gridArea: 'mt',
  },
  marginRight: {
    gridArea: 'mr',
  },
  marginBottom: {
    gridArea: 'mb',
  },
  marginLeft: {
    gridArea: 'ml',
  },
  paddingTop: {
    gridArea: 'pt',
  },
  paddingRight: {
    gridArea: 'pr',
  },
  paddingBottom: {
    gridArea: 'pb',
  },
  paddingLeft: {
    gridArea: 'pl',
  },
});

const IndentsBlock: React.FC<PropertiesChangeProps<LibraryElement<Entity>>> = ({
  updateStyles,
  removeStyles,
}) => {
  const classes = useStyles();
  const marginTop = useSelector(
    selectCurrentEditableStyles('marginTop'),
  ) as string;
  const marginBottom = useSelector(
    selectCurrentEditableStyles('marginBottom'),
  ) as string;
  const marginLeft = useSelector(
    selectCurrentEditableStyles('marginLeft'),
  ) as string;
  const marginRight = useSelector(
    selectCurrentEditableStyles('marginRight'),
  ) as string;
  const paddingTop = useSelector(
    selectCurrentEditableStyles('paddingTop'),
  ) as string;
  const paddingBottom = useSelector(
    selectCurrentEditableStyles('paddingBottom'),
  ) as string;
  const paddingLeft = useSelector(
    selectCurrentEditableStyles('paddingLeft'),
  ) as string;
  const paddingRight = useSelector(
    selectCurrentEditableStyles('paddingRight'),
  ) as string;

  const [state, setState] = useState({
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
  });
  const [debouncedState] = useDebounce(state, 250);

  useEffect(() => {
    updateStyles(debouncedState);
  }, [debouncedState, updateStyles]);

  const handleChange = (type, value) =>
    setState((prevState) => ({
      ...prevState,
      [type]: value,
    }));

  return (
    <div>
      <StylesHeader
        title="Margins & Paddings"
        onClick={removeStyles}
        cssPropertiesNames={[
          'marginTop',
          'marginRight',
          'marginBottom',
          'marginLeft',
          'paddingTop',
          'paddingRight',
          'paddingBottom',
          'paddingLeft',
        ]}
      />

      <div className={classes.marginGrid}>
        <div className={classes.capture}>Margin</div>

        <TextField
          title="Margin top"
          name="Margin top"
          type="number"
          margin="none"
          variant="outlined"
          className={cn(classes.input, classes.marginTop)}
          value={parseInt(state.marginTop) || 0}
          onChange={(ev) => handleChange('marginTop', `${ev.target.value}px`)}
        />

        <TextField
          title="Margin right"
          name="Margin right"
          type="number"
          margin="none"
          variant="outlined"
          className={cn(classes.input, classes.marginRight)}
          value={parseInt(state.marginRight) || 0}
          onChange={(ev) => handleChange('marginRight', `${ev.target.value}px`)}
        />

        <TextField
          title="Margin bottom"
          name="Margin bottom"
          type="number"
          margin="none"
          variant="outlined"
          className={cn(classes.input, classes.marginBottom)}
          value={parseInt(state.marginBottom) || 0}
          onChange={(ev) =>
            handleChange('marginBottom', `${ev.target.value}px`)
          }
        />

        <TextField
          title="Margin left"
          name="Margin left"
          type="number"
          margin="none"
          variant="outlined"
          className={cn(classes.input, classes.marginLeft)}
          value={parseInt(state.marginLeft) || 0}
          onChange={(ev) => handleChange('marginLeft', `${ev.target.value}px`)}
        />

        <div className={classes.paddingGrid}>
          <div className={classes.capture}>Padding</div>

          <TextField
            title="Padding top"
            name="Padding top"
            type="number"
            margin="none"
            variant="outlined"
            className={cn(classes.input, classes.paddingTop)}
            value={parseInt(state.paddingTop) || 0}
            onChange={(ev) =>
              handleChange('paddingTop', `${ev.target.value}px`)
            }
          />

          <TextField
            title="Padding right"
            name="Padding right"
            type="number"
            margin="none"
            variant="outlined"
            className={cn(classes.input, classes.paddingRight)}
            value={parseInt(state.paddingRight) || 0}
            onChange={(ev) =>
              handleChange('paddingRight', `${ev.target.value}px`)
            }
          />

          <TextField
            title="Padding bottom"
            name="Padding bottom"
            type="number"
            margin="none"
            variant="outlined"
            className={cn(classes.input, classes.paddingBottom)}
            value={parseInt(state.paddingBottom) || 0}
            onChange={(ev) =>
              handleChange('paddingBottom', `${ev.target.value}px`)
            }
          />

          <TextField
            title="Padding left"
            name="Padding left"
            type="number"
            margin="none"
            variant="outlined"
            className={cn(classes.input, classes.paddingLeft)}
            value={parseInt(state.paddingLeft) || 0}
            onChange={(ev) =>
              handleChange('paddingLeft', `${ev.target.value}px`)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default withConfigurableProperties(IndentsBlock);
