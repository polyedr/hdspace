import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { useDebouncedCallback } from 'use-debounce';
import makeStyles from '@material-ui/core/styles/makeStyles';
import withConfigurableProperties from '@Utils/withConfigurableProperties';
import { Entity, LibraryElement, PropertiesChangeProps } from '@Src/types';
import { StyledTextField } from '@Components/styledComponents';
import StylesHeader from '../../helperComponents/StylesHeader';

const useStyles = makeStyles(({ palette }) => ({
  marginGrid: {
    display: 'grid',
    gridTemplateAreas: `
        '.  .  mt .  . '
        '.  pg pg pg . '
        'ml pg pg pg mr'
        '.  pg pg pg . '
        '.  .  mb .  . '  
        `,
    border: `1px solid ${palette.grey.A200}`,
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
    border: `1px solid ${palette.grey.A200}`,
    position: 'relative',
  },
  capture: {
    position: 'absolute',
    top: 0,
    left: 0,
    fontStyle: 'italic',
    fontSize: '0.8em',
    color: palette.grey.A200,
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
}));

type Props = PropertiesChangeProps<LibraryElement<Entity>> & {
  marginTop?: React.CSSProperties['marginTop'];
  marginBottom?: React.CSSProperties['marginBottom'];
  marginLeft?: React.CSSProperties['marginLeft'];
  marginRight?: React.CSSProperties['marginRight'];
  paddingTop?: React.CSSProperties['paddingTop'];
  paddingBottom?: React.CSSProperties['paddingBottom'];
  paddingLeft?: React.CSSProperties['paddingLeft'];
  paddingRight?: React.CSSProperties['paddingRight'];
};

const IndentsBlock: React.FC<Props> = ({
  updateStyles,
  removeStyles,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
}) => {
  const classes = useStyles();
  const [state, setState] = useState({
    marginTop: marginTop || 0,
    marginLeft: marginLeft || 0,
    marginBottom: marginBottom || 0,
    marginRight: marginRight || 0,
    paddingTop: paddingTop || 0,
    paddingLeft: paddingLeft || 0,
    paddingBottom: paddingBottom || 0,
    paddingRight: paddingRight || 0,
  });
  useEffect(() => {
    setState({
      marginTop: marginTop || 0,
      marginLeft: marginLeft || 0,
      marginBottom: marginBottom || 0,
      marginRight: marginRight || 0,
      paddingTop: paddingTop || 0,
      paddingLeft: paddingLeft || 0,
      paddingBottom: paddingBottom || 0,
      paddingRight: paddingRight || 0,
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

        <StyledTextField
          title="Margin top"
          name="marginTop"
          type="number"
          margin="none"
          variant="outlined"
          className={cn(classes.input, classes.marginTop)}
          value={parseInt(state.marginTop as string)}
          onChange={handleChange}
        />

        <StyledTextField
          title="Margin right"
          name="marginRight"
          type="number"
          margin="none"
          variant="outlined"
          className={cn(classes.input, classes.marginRight)}
          value={parseInt(state.marginRight as string)}
          onChange={handleChange}
        />

        <StyledTextField
          title="Margin bottom"
          name="marginBottom"
          type="number"
          margin="none"
          variant="outlined"
          className={cn(classes.input, classes.marginBottom)}
          value={parseInt(state.marginBottom as string)}
          onChange={handleChange}
        />

        <StyledTextField
          title="Margin left"
          name="marginLeft"
          type="number"
          margin="none"
          variant="outlined"
          className={cn(classes.input, classes.marginLeft)}
          value={parseInt(state.marginLeft as string)}
          onChange={handleChange}
        />

        <div className={classes.paddingGrid}>
          <div className={classes.capture}>Padding</div>

          <StyledTextField
            title="Padding top"
            name="paddingTop"
            type="number"
            margin="none"
            variant="outlined"
            className={cn(classes.input, classes.paddingTop)}
            value={parseInt(state.paddingTop as string)}
            onChange={handleChange}
          />

          <StyledTextField
            title="Padding right"
            name="paddingRight"
            type="number"
            margin="none"
            variant="outlined"
            className={cn(classes.input, classes.paddingRight)}
            value={parseInt(state.paddingRight as string)}
            onChange={handleChange}
          />

          <StyledTextField
            title="Padding bottom"
            name="paddingBottom"
            type="number"
            margin="none"
            variant="outlined"
            className={cn(classes.input, classes.paddingBottom)}
            value={parseInt(state.paddingBottom as string)}
            onChange={handleChange}
          />

          <StyledTextField
            title="Padding left"
            name="paddingLeft"
            type="number"
            margin="none"
            variant="outlined"
            className={cn(classes.input, classes.paddingLeft)}
            value={parseInt(state.paddingLeft as string)}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default withConfigurableProperties(IndentsBlock);
