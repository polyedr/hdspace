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
        'ml pg pg pg . '
        'ml pg pg pg mr'
        'ml pg pg pg . '
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
    display: 'flex',
  },
  marginRight: {
    gridArea: 'mr',
  },
  marginBottom: {
    gridArea: 'mb',
    display: 'flex',
  },
  marginLeft: {
    gridArea: 'ml',
  },
  paddingTop: {
    gridArea: 'pt',
    display: 'flex',
  },
  paddingRight: {
    gridArea: 'pr',
  },
  paddingBottom: {
    gridArea: 'pb',
    display: 'flex',
  },
  paddingLeft: {
    gridArea: 'pl',
  },
  topLeftAndRightBottomCorner: {
    borderTop: '24px solid red',
    borderLeft: '24px solid transparent',
    width: 0,
  },
  topRightAndLeftBottomCorner: {
    borderTop: '24px solid red',
    borderRight: '24px solid transparent',
    width: 0,
  },
  rightTopAndBottomLeftCorner: {
    borderBottom: '24px solid red',
    borderLeft: '24px solid transparent',
    width: 0,
  },
  bottomRightAndLeftTopCorner: {
    borderBottom: '24px solid red',
    borderRight: '24px solid transparent',
    width: 0,
  },
  intentsContainer: {
    backgroundColor: 'red',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalMarginContainer: {
    width: '175px',
    height: '24px',
  },
  verticalMarginContainer: {
    width: '24px',
    height: '74px',
  },
  horizontalPaddingContainer: {
    width: '125px',
    height: '24px',
  },
  verticalPaddingContainer: {
    width: '24px',
    height: '24px',
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
      ? defaultStyles?.indents
      : {
          marginTop,
          marginLeft,
          marginBottom,
          marginRight,
          paddingTop,
          paddingLeft,
          paddingRight,
          paddingBottom,
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
    defaultStyles,
    isDefaultStyles,
  ]);

  const debounced = useDebouncedCallback((name, value) => {
    updateStyles({ [name]: value });
  }, 500);

  const handleChange = ({ target: { value, name } }) => {
    let val;
    if (
      name === 'paddingTop' ||
      name === 'paddingBottom' ||
      name === 'paddingRight' ||
      name === 'paddingLeft'
    ) {
      if (value < 0) {
        val = 0;
      } else {
        val = value;
      }
    } else {
      val = value;
    }
    setState({ ...state, [name]: val } as Indents);
    debounced.callback(name, `${val}px`);
  };
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
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

      <div style={{ width: '227px', height: '124px' }}>
        <div className={cn(classes.marginTop)}>
          <div className={cn(classes.topLeftAndRightBottomCorner)} />
          <div
            className={cn(
              classes.intentsContainer,
              classes.horizontalMarginContainer,
            )}
          >
            <StyledTextField
              title="Margin top"
              name="marginTop"
              type="number"
              margin="none"
              variant="outlined"
              className={cn(classes.input)}
              value={(state && parseInt(state.marginTop as string)) || 0}
              onChange={handleChange}
              disabled={!canEdit}
            />
          </div>
          <div className={cn(classes.topRightAndLeftBottomCorner)} />
        </div>

        <div
          style={{
            position: 'relative',
            left: '199px',
            bottom: '22px',
          }}
          className={cn(classes.marginRight)}
        >
          <div className={cn(classes.rightTopAndBottomLeftCorner)} />
          <div
            className={cn(
              classes.intentsContainer,
              classes.verticalMarginContainer,
            )}
          >
            <StyledTextField
              title="Margin right"
              name="marginRight"
              type="number"
              margin="none"
              variant="outlined"
              className={cn(classes.input)}
              value={(state && parseInt(state.marginRight as string)) || 0}
              onChange={handleChange}
              disabled={!canEdit}
            />
          </div>
          <div className={classes.topLeftAndRightBottomCorner} />
        </div>

        <div
          className={cn(classes.marginBottom)}
          style={{
            position: 'relative',
            bottom: '44px',
          }}
        >
          <div className={cn(classes.rightTopAndBottomLeftCorner)} />
          <div
            className={cn(
              classes.intentsContainer,
              classes.horizontalMarginContainer,
            )}
          >
            <StyledTextField
              title="Margin bottom"
              name="marginBottom"
              type="number"
              margin="none"
              variant="outlined"
              className={cn(classes.input)}
              value={(state && parseInt(state.marginBottom as string)) || 0}
              onChange={handleChange}
              disabled={!canEdit}
            />
          </div>
          <div className={cn(classes.bottomRightAndLeftTopCorner)} />
        </div>

        <div
          className={cn(classes.marginLeft)}
          style={{
            position: 'relative',
            bottom: '168px',
          }}
        >
          <div className={cn(classes.bottomRightAndLeftTopCorner)} />
          <div
            className={cn(
              classes.intentsContainer,
              classes.verticalMarginContainer,
            )}
          >
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
          </div>
          <div className={cn(classes.topRightAndLeftBottomCorner)} />
        </div>

        <div
          style={{
            position: 'relative',
            bottom: '267px',
            left: '25px',
          }}
          className={cn(classes.paddingTop)}
        >
          <div className={cn(classes.topLeftAndRightBottomCorner)} />
          <div
            className={cn(
              classes.intentsContainer,
              classes.horizontalPaddingContainer,
            )}
          >
            <StyledTextField
              title="Padding top"
              name="paddingTop"
              type="number"
              margin="none"
              variant="outlined"
              className={cn(classes.input)}
              value={(state && parseInt(state.paddingTop as string)) || 0}
              onChange={handleChange}
              disabled={!canEdit}
            />
          </div>
          <div className={cn(classes.topRightAndLeftBottomCorner)} />
        </div>

        <div
          style={{
            position: 'relative',
            bottom: '289px',
            left: '174px',
          }}
          className={cn(classes.paddingRight)}
        >
          <div className={cn(classes.rightTopAndBottomLeftCorner)} />
          <div
            className={cn(
              classes.intentsContainer,
              classes.verticalPaddingContainer,
            )}
          >
            <StyledTextField
              title="Padding right"
              name="paddingRight"
              type="number"
              margin="none"
              variant="outlined"
              className={cn(classes.input)}
              value={(state && parseInt(state.paddingRight as string)) || 0}
              onChange={handleChange}
              disabled={!canEdit}
            />
          </div>
          <div className={classes.topLeftAndRightBottomCorner} />
        </div>

        <div
          style={{ position: 'relative', bottom: '311px', left: '25px' }}
          className={cn(classes.paddingBottom)}
        >
          <div className={cn(classes.rightTopAndBottomLeftCorner)} />
          <div
            className={cn(
              classes.intentsContainer,
              classes.horizontalPaddingContainer,
            )}
          >
            <StyledTextField
              title="Padding bottom"
              name="paddingBottom"
              type="number"
              margin="none"
              variant="outlined"
              className={cn(classes.input)}
              value={(state && parseInt(state.paddingBottom as string)) || 0}
              onChange={handleChange}
              disabled={!canEdit}
            />
          </div>
          <div className={cn(classes.bottomRightAndLeftTopCorner)} />
        </div>

        <div
          style={{
            position: 'relative',
            bottom: '385px',
            left: '25px',
          }}
          className={cn(classes.paddingLeft)}
        >
          <div className={cn(classes.bottomRightAndLeftTopCorner)} />
          <div
            className={cn(
              classes.intentsContainer,
              classes.verticalPaddingContainer,
            )}
          >
            <StyledTextField
              title="Padding left"
              name="paddingLeft"
              type="number"
              margin="none"
              variant="outlined"
              className={cn(classes.input)}
              value={(state && parseInt(state.paddingLeft as string)) || 0}
              onChange={handleChange}
              disabled={!canEdit}
            />
          </div>
          <div className={classes.topRightAndLeftBottomCorner} />
        </div>
      </div>
    </div>
  );
};

export default IndentsBlock;
