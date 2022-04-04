import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { useDebouncedCallback } from 'use-debounce';
import {
  Entity,
  Indents,
  LibraryElement,
  PropertiesChangeProps,
} from '@Src/types';
import { StyledTextField } from '@Components/styledComponents';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { selectCurrentProjectDefaultStyles } from '@Redux/project/selectors/base';
import RemoveStyles from '../../helperComponents/RemoveStyles';

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
  isDefaultStyles?: boolean;
};

const IndentsBlock: React.FC<Props> = ({
  element,
  updateStyles,
  removeStyles,
  masterScreenEnabled,
  editableStyles,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  canEdit,
  isDefaultStyles = false,
}) => {
  const defaultStyles = useSelector(selectCurrentProjectDefaultStyles);
  const classes = useStyles();
  const [state, setState] = useState<Indents | null>(null);
  useEffect(() => {
    const styles = isDefaultStyles
      ? defaultStyles.indents
      : {
          marginTop,
          marginLeft,
          marginBottom,
          marginRight,
          paddingTop,
          paddingLeft,
          paddingRight,
        };
    setState(styles as Indents);
  }, [
    marginTop,
    marginLeft,
    marginBottom,
    marginRight,
    paddingTop,
    paddingLeft,
    paddingBottom,
    paddingRight,
    defaultStyles.indents,
    isDefaultStyles,
  ]);

  const debounced = useDebouncedCallback((name, value) => {
    updateStyles({ [name]: value });
  }, 500);

  const handleChange = ({ target: { value, name } }) => {
    setState({ ...state, [name]: value } as Indents);
    debounced.callback(name, `${value}px`);
  };

  return (
    <div>
      {!isDefaultStyles && !masterScreenEnabled && canEdit && (
        <RemoveStyles
          onClick={removeStyles}
          propsToRemove={[
            'marginTop',
            'marginRight',
            'marginBottom',
            'marginLeft',
            'paddingTop',
            'paddingRight',
            'paddingBottom',
            'paddingLeft',
          ]}
          type={element.type}
          editableStyles={editableStyles}
        />
      )}

      <div className={classes.marginGrid}>
        <div className={classes.capture}>Margin</div>

        <StyledTextField
          title="Margin top"
          name="marginTop"
          type="number"
          margin="none"
          variant="outlined"
          className={cn(classes.input, classes.marginTop)}
          value={(state && parseInt(state.marginTop as string)) || 0}
          onChange={handleChange}
          disabled={!canEdit}
        />

        <StyledTextField
          title="Margin right"
          name="marginRight"
          type="number"
          margin="none"
          variant="outlined"
          className={cn(classes.input, classes.marginRight)}
          value={(state && parseInt(state.marginRight as string)) || 0}
          onChange={handleChange}
          disabled={!canEdit}
        />

        <StyledTextField
          title="Margin bottom"
          name="marginBottom"
          type="number"
          margin="none"
          variant="outlined"
          className={cn(classes.input, classes.marginBottom)}
          value={(state && parseInt(state.marginBottom as string)) || 0}
          onChange={handleChange}
          disabled={!canEdit}
        />

        <StyledTextField
          title="Margin left"
          name="marginLeft"
          type="number"
          margin="none"
          variant="outlined"
          className={cn(classes.input, classes.marginLeft)}
          value={(state && parseInt(state.marginLeft as string)) || 0}
          onChange={handleChange}
          disabled={!canEdit}
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
            value={(state && parseInt(state.paddingTop as string)) || 0}
            onChange={handleChange}
            disabled={!canEdit}
          />

          <StyledTextField
            title="Padding right"
            name="paddingRight"
            type="number"
            margin="none"
            variant="outlined"
            className={cn(classes.input, classes.paddingRight)}
            value={(state && parseInt(state.paddingRight as string)) || 0}
            onChange={handleChange}
            disabled={!canEdit}
          />

          <StyledTextField
            title="Padding bottom"
            name="paddingBottom"
            type="number"
            margin="none"
            variant="outlined"
            className={cn(classes.input, classes.paddingBottom)}
            value={(state && parseInt(state.paddingBottom as string)) || 0}
            onChange={handleChange}
            disabled={!canEdit}
          />

          <StyledTextField
            title="Padding left"
            name="paddingLeft"
            type="number"
            margin="none"
            variant="outlined"
            className={cn(classes.input, classes.paddingLeft)}
            value={(state && parseInt(state.paddingLeft as string)) || 0}
            onChange={handleChange}
            disabled={!canEdit}
          />
        </div>
      </div>
    </div>
  );
};

export default IndentsBlock;
