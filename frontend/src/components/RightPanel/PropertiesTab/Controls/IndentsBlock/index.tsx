import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { useSelector } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TextField from '@material-ui/core/TextField';
import { useDebouncedCallback } from 'use-debounce';
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
    marginLeft,
    marginBottom,
    marginRight,
    paddingTop,
    paddingLeft,
    paddingBottom,
    paddingRight,
  });
  useEffect(() => {
    setState({
      marginTop,
      marginLeft,
      marginBottom,
      marginRight,
      paddingTop,
      paddingLeft,
      paddingBottom,
      paddingRight,
    });
  }, [
    marginTop,
    marginLeft,
    marginBottom,
    marginRight,
    paddingTop,
    paddingLeft,
    paddingBottom,
    paddingRight,
  ]);

  const debounced = useDebouncedCallback((name, value) => {
    updateStyles({ [name]: value });
  }, 500);

  const handleChange = ({ target: { value, name } }) => {
    setState({ ...state, [name]: value });
    debounced.callback(name, `${value}px`);
  };

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
          name="marginTop"
          type="number"
          margin="none"
          variant="outlined"
          className={cn(classes.input, classes.marginTop)}
          value={parseInt(state.marginTop) || 0}
          onChange={handleChange}
        />

        <TextField
          title="Margin right"
          name="marginRight"
          type="number"
          margin="none"
          variant="outlined"
          className={cn(classes.input, classes.marginRight)}
          value={parseInt(state.marginRight) || 0}
          onChange={handleChange}
        />

        <TextField
          title="Margin bottom"
          name="marginBottom"
          type="number"
          margin="none"
          variant="outlined"
          className={cn(classes.input, classes.marginBottom)}
          value={parseInt(state.marginBottom) || 0}
          onChange={handleChange}
        />

        <TextField
          title="Margin left"
          name="marginLeft"
          type="number"
          margin="none"
          variant="outlined"
          className={cn(classes.input, classes.marginLeft)}
          value={parseInt(state.marginLeft) || 0}
          onChange={handleChange}
        />

        <div className={classes.paddingGrid}>
          <div className={classes.capture}>Padding</div>

          <TextField
            title="Padding top"
            name="paddingTop"
            type="number"
            margin="none"
            variant="outlined"
            className={cn(classes.input, classes.paddingTop)}
            value={parseInt(state.paddingTop) || 0}
            onChange={handleChange}
          />

          <TextField
            title="Padding right"
            name="paddingRight"
            type="number"
            margin="none"
            variant="outlined"
            className={cn(classes.input, classes.paddingRight)}
            value={parseInt(state.paddingRight) || 0}
            onChange={handleChange}
          />

          <TextField
            title="Padding bottom"
            name="paddingBottom"
            type="number"
            margin="none"
            variant="outlined"
            className={cn(classes.input, classes.paddingBottom)}
            value={parseInt(state.paddingBottom) || 0}
            onChange={handleChange}
          />

          <TextField
            title="Padding left"
            name="paddingLeft"
            type="number"
            margin="none"
            variant="outlined"
            className={cn(classes.input, classes.paddingLeft)}
            value={parseInt(state.paddingLeft) || 0}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default withConfigurableProperties(IndentsBlock);
