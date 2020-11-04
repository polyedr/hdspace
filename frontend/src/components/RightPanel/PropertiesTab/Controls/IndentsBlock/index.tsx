import React, { useCallback } from 'react';
import cn from 'classnames';
import { connect } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TextField from '@material-ui/core/TextField';
import { Entity } from '../../../../../domain/core';
import { AppReduxState } from '../../../../../shared/types/app';
import { LibraryElement } from '../../../../../api/types';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../utils/withConfigurableProperties';
import { selectCurrentEditableStyles } from '../../../../../redux/project/selectors';
import StylesHeader from '../../helperComponents/StylesHeader';

const useStyles = makeStyles({
  marginGrid: {
    display: 'grid',
    gridTemplateAreas: `
        '.  .  mt .  . '
        '.  pg pg pg  . '
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

function mapState(state: AppReduxState) {
  return {
    marginTop: selectCurrentEditableStyles(state, 'margin-top'),
    marginRight: selectCurrentEditableStyles(state, 'margin-right'),
    marginBottom: selectCurrentEditableStyles(state, 'margin-bottom'),
    marginLeft: selectCurrentEditableStyles(state, 'margin-left'),
    paddingTop: selectCurrentEditableStyles(state, 'padding-top'),
    paddingRight: selectCurrentEditableStyles(state, 'padding-right'),
    paddingBottom: selectCurrentEditableStyles(state, 'padding-bottom'),
    paddingLeft: selectCurrentEditableStyles(state, 'padding-left'),
  };
}

type Props = ReturnType<typeof mapState> &
  PropertiesChangeProps<LibraryElement<Entity>>;

const IndentsBlock: React.FC<Props> = ({
  updateStyles,
  removeStyles,
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,
  paddingTop,
  paddingRight,
  paddingBottom,
  paddingLeft,
}) => {
  const classes = useStyles();

  const handleIndentChange = useCallback(
    (type: string, value: string) => {
      updateStyles({ [type]: value });
    },
    [updateStyles],
  );

  return (
    <div>
      <StylesHeader
        title="Margins & Paddings"
        onClick={removeStyles}
        cssPropertiesNames={[
          'margin-top',
          'margin-right',
          'margin-bottom',
          'margin-left',
          'padding-top',
          'padding-right',
          'padding-bottom',
          'padding-left',
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
          value={parseInt(marginTop)}
          onChange={(event) =>
            handleIndentChange('margin-top', `${event.target.value}px`)
          }
        />

        <TextField
          title="Margin right"
          name="Margin right"
          type="number"
          margin="none"
          variant="outlined"
          className={cn(classes.input, classes.marginRight)}
          value={parseInt(marginRight)}
          onChange={(event) =>
            handleIndentChange('margin-right', `${event.target.value}px`)
          }
        />

        <TextField
          title="Margin bottom"
          name="Margin bottom"
          type="number"
          margin="none"
          variant="outlined"
          className={cn(classes.input, classes.marginBottom)}
          value={parseInt(marginBottom)}
          onChange={(event) =>
            handleIndentChange('margin-bottom', `${event.target.value}px`)
          }
        />

        <TextField
          title="Margin left"
          name="Margin left"
          type="number"
          margin="none"
          variant="outlined"
          className={cn(classes.input, classes.marginLeft)}
          value={parseInt(marginLeft)}
          onChange={(event) =>
            handleIndentChange('margin-left', `${event.target.value}px`)
          }
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
            value={parseInt(paddingTop)}
            onChange={(event) =>
              handleIndentChange('padding-top', `${event.target.value}px`)
            }
          />

          <TextField
            title="Padding right"
            name="Padding right"
            type="number"
            margin="none"
            variant="outlined"
            className={cn(classes.input, classes.paddingRight)}
            value={parseInt(paddingRight)}
            onChange={(event) =>
              handleIndentChange('padding-right', `${event.target.value}px`)
            }
          />

          <TextField
            title="Padding bottom"
            name="Padding bottom"
            type="number"
            margin="none"
            variant="outlined"
            className={cn(classes.input, classes.paddingBottom)}
            value={parseInt(paddingBottom)}
            onChange={(event) =>
              handleIndentChange('padding-bottom', `${event.target.value}px`)
            }
          />

          <TextField
            title="Padding left"
            name="Padding left"
            type="number"
            margin="none"
            variant="outlined"
            className={cn(classes.input, classes.paddingLeft)}
            value={parseInt(paddingLeft)}
            onChange={(event) =>
              handleIndentChange('padding-left', `${event.target.value}px`)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default connect(mapState)(withConfigurableProperties(IndentsBlock));
